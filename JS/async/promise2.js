const p1 = new Promise((resolve, reject) => {
    resolve('p1 succeeds');
}).then(res => console.log(res));

const p2 = new Promise((resolve, reject) => {
    reject('p2 failed');
}).then(res => console.log(res))
  .catch(res => console.log("Catch: " + res));
