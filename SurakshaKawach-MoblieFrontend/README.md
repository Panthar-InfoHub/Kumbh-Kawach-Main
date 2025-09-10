# 🚨 Suraksha Kawach

**Suraksha Kawach** is a cutting-edge safety application developed by **Panthar InfoHub Pvt. Ltd.**, designed to provide immediate help and protection during emergencies. Whether you are online or offline, Suraksha Kawach ensures your loved ones and authorities are instantly notified with accurate location and multimedia details, keeping you safe anywhere, anytime.

---

## 🌟 Key Features

- **SOS Emergency Trigger**  
  Instantly send an SOS alert to registered family members and nearby police with live location and multimedia (images & audio) evidence.

- **Offline Functionality**  
  Even without an active internet connection, SOS requests and multimedia sharing work seamlessly through offline protocols.

- **Voice Command Activation**  
  Activate the SOS alert hands-free using pre-set voice commands, even when the app is closed.

- **Live Location Tracking**  
  Share real-time location continuously with emergency contacts until help arrives.

- **Multimedia Sharing**  
  Attach live audio recordings and images while sending the SOS alert for better context and faster assistance.

- **Guardian & Volunteer Network**  
  Guardians can monitor the safety of users. In remote areas, registered volunteers can assist immediately.

- **Police SOS Integration**  
  Direct connection to the nearby police station for official intervention during emergencies.

---

## 🏡 Security & Privacy

- **Data Security**: All user data, including location and media, is securely encrypted and shared **only** with verified contacts (family, police, guardians).
- **Minimal Permissions**: The app requests only essential permissions like location, camera, microphone, and storage.
- **No Unnecessary Data Sharing**: No data is shared with third parties or unauthorized personnel.

---

## 📱 Technology Stack

| Layer            | Technology                                      |
|------------------|-------------------------------------------------|
| **Frontend**     | Kotlin, Jetpack Compose                          |
| **Backend**      | Node.js, MongoDB, Google Cloud Functions         |
| **Authentication**| Firebase Authentication + Google Sign-In       |
| **Voice Activation**| Picovoice Integration                         |
| **APIs**         | RESTful APIs secured with authentication tokens  |
| **Deployment**   | Google Cloud, Firebase Hosting                  |

---

## 🚀 Getting Started (For Developers)

### Prerequisites
- Android Studio (latest version)
- Kotlin, Jetpack Compose knowledge
- Firebase & Google Cloud account access
- Picovoice API credentials

### Clone Repository
```bash
git clone https://github.com/your-org/suraksha-kawach.git
cd suraksha-kawach
```

### Set up Firebase
1. Add your `google-services.json` file in the `app/` directory.
2. Enable Firebase Authentication and Google Sign-In.

### Configure Picovoice
- Add Picovoice SDK and API keys in `local.properties` or secure environment file.

### Run Project
```bash
./gradlew assembleDebug
```

---

## 📄 API Documentation

Base URL:  
`https://surakshakawach-mobilebackend-192854867616.asia-south2.run.app/api/v1/`

### Key Endpoints:
| Endpoint                          | Functionality                       |
|-----------------------------------|-------------------------------------|
| `/user`                           | Get User Profile & Emergency Contacts |
| `/ticket/create`                  | Create Emergency SOS Ticket        |
| `/ticket/update`                  | Update Location & Multimedia Data  |
| `/ticket/close`                   | Close Existing Ticket              |

[Full API Docs →](https://##.com)

---

## 🤝 Contributing

We welcome contributions from developers passionate about safety and public welfare.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📢 Contact & Support

For queries, collaborations, or support:
- 🌐 Website: [www.suraksha.pantharinfohub.com](https://www.suraksha.pantharinfohub.com)
- 📧 Email: connect@pantharinfohub.com
- 📞 Phone: +91-6387161020

---

## 📜 License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) and [NOTICE](NOTICE) files for details.

---

**Stay Protected. Stay Safe. Suraksha Kawach – Your Safety Shield.**

