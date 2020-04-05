var getTest = <%= test  %>;  //var test is now assigned to getTest which will only work on browsers
console.log('test: ', getTest);  // successfully prints 101 on browser

//X1 data
var X1 = [0.50, 0.38, 0.31, 0.47, 0.38, 1.00, 0.53];
//X2 data
var X2 = [0.51, 0.50, 0.15, 0.03, 1.00, 0.74, 0.35];

console.log('data: ', test)
var ctx = document.getElementById("myChart").getContext('2d');

// Define the data

var values = [{
    x: X1[0],
    y: X2[0]
},
{
    x: X1[1],
    y: X2[1]
}, {
    x: X1[2],
    y: X2[2]
},
{
    x: X1[3],
    y: X2[3]
},
{
    x: X1[4],
    y: X2[4]
},
{
    x: X1[5],
    y: X2[5]
},
{
    x: X1[6],
    y: X2[6]
}

]; // Add data values to array

console.log('values: ',value)
// End Defining data
var options = {
    responsive: true, // Instruct chart js to respond nicely.
    maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
};

// End Defining data
var myChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'Population', // Name the series
            borderColor: '#2196f3', // Add custom color border
            backgroundColor: '#2196f3', // Add custom color background (Points and Fill)
            data: values, // Specify the data values array
        }]
    },
    options: options
});