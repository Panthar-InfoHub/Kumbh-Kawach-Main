package com.nextlevelprogrammers.surakshakawach.IntentAction

import com.nextlevelprogrammers.surakshakawach.uidesign.ContactInfo


sealed interface ContactScreenAction {
    data object OnClickAddContact: ContactScreenAction
    data class OnClickSaveContact(val contact: ContactInfo): ContactScreenAction
    data object OnCancelSaveContact:ContactScreenAction
    data class OnSwipeContactDelete(val contact: ContactInfo): ContactScreenAction
    data class OnSwipeContactEdit(val contact: ContactInfo): ContactScreenAction
    data class OnClickEditSave(val contact: ContactInfo, val newName:String, val newNumber: String, val newEmail:String, val newRelation:String): ContactScreenAction
    data object OnClickEditCancel : ContactScreenAction

    data object FetchContactsFromApi : ContactScreenAction
}