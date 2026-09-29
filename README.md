# WebRTC (Web Real-Time Communication) Test

Test of the WebRTC framework [Trystero](https://trystero.dev/) with [GitHub](https://github.com/dmotz/trystero)

Simple test app using birds that randomize based on users entering the room with objects that can be dropped.  Wanted to see how difficult it would be to set up something functional with at least a slight amount of user to user interaction.

Tests ability of multiple users to log onto a room instance and view the actions of other users.

Can be tried at [Trystero Test Live](https://araesmojo-eng.github.io/trystero_test/)

NOTE: Since it's unlikely multiple people connect to such a small site at the same time, try opening a second browser window and connecting to see the effect with multiple participants.

May eventually try setting up a wss (websocket) endpoint for personally routed connections.  Currently connects to the public Nostr networks.  Already had some issue with vaguely sketchy seeming Bitcoin sites showing up in the "trying to connect, dropped connection"

Swapped over to a different default module routing service and it seems to have alleviated those issues.
