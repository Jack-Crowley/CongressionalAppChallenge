const data = []

let maxLength = 49;

document.querySelectorAll(".dataEvent").forEach((event) => {
  let registrationCount = parseInt(event.children[3].textContent, 10)
  let date = event.children[1].textContent
  let day = new Date(date).getDay();
  let hour = new Date(date).getHours();
  let keywords = event.children[2].textContent

  keywords = keywords.split(",").map(str => parseInt(str, 10));
  if (isNaN(keywords[0])) {
    keywords = [0]
  }

  data.push({ registrationCount: registrationCount, day: day, hour: hour, keywords: keywords, interests: [0], output: 1 })
})

for (let i = 0; i < data.length; i++) {
  let keywordsArray = data[i].keywords;

  // Check if the length of the "keywords" array is less than the maximum length
  if (keywordsArray.length < maxLength) {
    // Calculate the number of zeros to add
    let zerosToAdd = maxLength - keywordsArray.length;

    // Add zeros to the end of the "keywords" array
    for (let j = 0; j < zerosToAdd; j++) {
      keywordsArray.push(0);
    }
  }
}

console.log(data)

// Convert the real data into input and output tensors
const inputData1 = data.map(sample => [sample.registrationCount, sample.day, sample.hour]);
const inputData2 = data.map(sample => sample.keywords.concat(sample.interests));
const outputData = data.map(sample => [sample.output]);

console.log(inputData2)

const input1 = tf.tensor2d(inputData1);
const input2 = tf.tensor2d(inputData2);
const output = tf.tensor2d(outputData);

// Define the model
const input1Layer = tf.input({ shape: [3] });
const input2Layer = tf.input({ shape: [maxLength + 1] }); // Assuming array1 and array2 have 5 elements each
const concatenatedInputs = tf.layers.concatenate().apply([input1Layer, input2Layer]);

const dense1 = tf.layers.dense({ units: 8, activation: 'relu' }).apply(concatenatedInputs);
const dense2 = tf.layers.dense({ units: 1, activation: 'sigmoid' }).apply(dense1);

const model = tf.model({ inputs: [input1Layer, input2Layer], outputs: dense2 });

// Compile the model
model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });


// Train the model with real data
model.fit([input1, input2], output, { epochs: 10 })
  .then(history => {
    let events = []
    document.querySelectorAll(".event .hiddenInfo").forEach((event) => {
      let registrationCount = parseInt(event.children[3].textContent, 10)
      let date = event.children[1].textContent
      let day = new Date(date).getDay();
      let hour = new Date(date).getHours();
      let keywords = event.children[2].textContent

      keywords = keywords.split(",").map(str => parseInt(str, 10));
      if (isNaN(keywords[0])) {
        keywords = [0]
      }

      let zerosToAdd = maxLength - keywords.length;

      for (let j = 0; j < zerosToAdd; j++) {
        keywords.push(0);
      }

      maxLength = Math.max(maxLength, keywords.length)

      const newDataSample = { registrationCount: registrationCount, day: day, hour: hour, keywords: keywords, interests: [0], output: 1 }

      const newInput1 = tf.tensor2d([[newDataSample.registrationCount, newDataSample.day, newDataSample.hour]]);
      let newInput2 = tf.tensor2d([newDataSample.keywords.concat(newDataSample.interests)]);

      console.log("SHAPE:" + newInput2.shape[0])

      console.log("inputs")
      newInput1.print()
      newInput2.print()

      const prediction = model.predict([newInput1, newInput2]);

      let arr = prediction.arraySync()[0]

      events.push({ value: arr[0], eventID: parseInt(event.dataset.id, 10) })
      prediction.print();
    })

    const eventsArray = Array.from(document.querySelectorAll('.eventsContainer > div'));

    // Step 2: Sort the array based on values in descending order
    const sortedList = events.sort((a, b) => b.value - a.value);

    // Step 3: Rearrange the order of the event divs in the "events" container
    const eventsDiv = document.querySelector('.eventsContainer');
    eventsDiv.innerHTML = ''; // Clear existing content

    sortedList.forEach(entry => {
      const eventDiv = eventsArray.find(div => div.dataset.eventid === entry.eventID.toString());
      if (eventDiv) {
        eventsDiv.appendChild(eventDiv);
      }
    });
  });