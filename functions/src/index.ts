import * as functions from "firebase-functions"

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// export const checkOrderPrice = functions.firestore
// 	.document("orders/{docId}")
// 	.onCreate((snap, context) => {
// 		let newValue = { ...snap.data() }
//     functions.logger.log("Testing onCreate firestore",context.params.docId, newValue)

//     const updated = {...newValue,testField: "allOk"}

//     return snap.ref.set({...updated})
// 	})
