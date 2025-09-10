from fastapi import FastAPI
from pymongo import MongoClient
from google.cloud import storage
from google.oauth2 import service_account
from facenet_pytorch import InceptionResnetV1
from PIL import Image
from bson import ObjectId
import torch, io, os
from dotenv import load_dotenv
from torchvision import transforms
from datetime import timedelta
import numpy as np

app = FastAPI()
load_dotenv()

# ===== MongoDB Setup =====
mongo_client = MongoClient(os.environ["DB_URI"])
db = mongo_client["kumb_kawach"]
users = db["users"]

# ===== Google Cloud Storage Setup =====
credentials = service_account.Credentials.from_service_account_info(
    {
        "type": "service_account",
        "project_id": os.environ["PROJECT_ID"],
        "private_key_id": os.environ["PRIVATE_KEY_ID"],
        "private_key": os.environ["PRIVATE_KEY"].replace("\\n", "\n"),
        "client_email": os.environ["CLIENT_EMAIL"],
        "client_id": os.environ["CLIENT_ID"],
        "token_uri": os.environ["TOKEN_URI"],
    }
)
gcs_client = storage.Client(credentials=credentials, project=os.environ["PROJECT_ID"])
bucket = gcs_client.bucket("kumbh-bucket")

# ===== FaceNet Model =====
model = InceptionResnetV1(pretrained="vggface2").eval()
preprocess = transforms.Compose([transforms.Resize((160, 160)), transforms.ToTensor()])


# ======= Signed Url of Image =====
def generate_signed_url(file_path: str) -> str:
    print("\n inside generating signed url.... ")
    blob = bucket.blob(file_path)
    url = blob.generate_signed_url(
        version="v4",
        expiration=timedelta(minutes=10),
        method="GET",
    )
    print("\nUrl of image ==> ", url)
    return url


@app.get("/health")
def health_check():
    return {"message": "Hello kumbh python server is running..."}


@app.post("/embed")
def generate_embedding(data: dict):
    user_id = data["userId"]

    # 1. Fetch user
    user = users.find_one({"_id": ObjectId(user_id)})
    print("User found ==> ", user)
    if not user:
        return {"error": "User not found"}

    if "photoUrl" not in user:
        return {"error": "No photoUrl in user document"}

    # 2. Download image from GCS
    generate_signed_url(user["photoUrl"])
    blob = bucket.blob(user["photoUrl"])
    img_bytes = blob.download_as_bytes()
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

    # 3. Preprocess
    print("\nStart preprocessing....")
    img_tensor = preprocess(img).unsqueeze(0)

    # 4. Embed
    with torch.no_grad():
        print("\nStart embedding....")
        embedding = model(img_tensor).detach().cpu().numpy()[0].tolist()

    # 5. Update DB
    print("\nStart updating user....")
    users.update_one({"_id": ObjectId(user_id)}, {"$set": {"embedding": embedding}})
    print("\n User updated successfully...")

    return {"userId": user_id, "embeddingDim": len(embedding), "status": "updated"}


@app.post("/match")
def match_face(data: dict):
    print("\nAm in matching api")
    photo_url = data["photoUrl"]

    # 1. Download image from GCS
    blob = bucket.blob(photo_url)
    img_bytes = blob.download_as_bytes()
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

    # 2. Preprocess & embed
    img_tensor = preprocess(img).unsqueeze(0)
    with torch.no_grad():
        new_embedding = model(img_tensor).detach().cpu().numpy()[0]

    # 3. Compare with all stored embeddings
    all_users = users.find({"embedding": {"$exists": True}})
    best_match, best_score = None, -1

    for candidate in all_users:
        stored_embedding = candidate.get("embedding", [])

        if not stored_embedding or len(stored_embedding) != len(new_embedding):
            continue

        stored_embedding = np.array(stored_embedding)

        # cosine similarity
        sim = np.dot(new_embedding, stored_embedding) / (
            np.linalg.norm(new_embedding) * np.linalg.norm(stored_embedding)
        )

        if sim > best_score:
            best_score = sim
            best_match = candidate

    if not best_match:
        return {"success": False, "message": "No valid embeddings found in database"}

    print(f"\nBest match: {best_match['_id']} with similarity {best_score}")
    user = users.find_one(
        {"_id": ObjectId(best_match["_id"])},
        {"embedding": 0}
    )

    if user and "_id" in user:
        user["_id"] = str(user["_id"])

    # Only return success if similarity > threshold (0.75)
    if best_score > 0.75:
        return {
            "success": True,
            "message": "Matching user found",
            "matchedUser": user,
            "similarity": float(best_score),
        }
    else:
        return {
            "success": False,
            "message": "No user match found",
            "similarity": float(best_score),
        }
