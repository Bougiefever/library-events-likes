var Queue = require('firebase-queue');
var admin = require("firebase-admin");

var serviceAccount = require("./browncountylibraryevents-firebase-adminsdk-ar0mr-71ef294f02.json");
console.log('hi');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://browncountylibraryevents.firebaseio.com"
});

console.log('initialized');
var db = admin.database();
var instructorsRef = db.ref('instructors');

processLikes();

function processLikes() {
    var queueRef = db.ref('queue/likes');

    console.log('start queue');
    var queue = new Queue(queueRef, function(data, progress, resolve, reject)  {
        console.log('getting item');
         progress(10);

        console.log('queue processing ', data.instructorKey);
        progress(90);
        var instructorRef = instructorsRef.child(data.instructorKey);
        instructorRef.once('value', function(snapshot) {
            var instructor = snapshot.val();
            var likes = instructor.likes + 1;
            instructorRef.update({likes: likes})
                .then(resolve)
                .catch(reject);
        });
    });
}
