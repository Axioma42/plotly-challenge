function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(sample_metadata){

    // Use d3 to select the panel with id of `#sample-metadata`
    var metadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(sample_metadata).forEach(([key, value]) => {
      metadata
        .append("p")
        .text(`${key} : ${value}`)
      });
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;

    // @TODO: Build a Bubble Chart using the sample data
    d3.json(url).then(function(data) {

      console.log(data);
    
      var bbl = {
        type: "scatter",
        mode: "markers",
        x: data.otu_ids,
        y: data.sample_values,
        text: data.otu_labels,
        marker: {
          color: data.otu_ids,
          size: data.sample_values,
          colorscale: 'YIGnBu',
        }
      };
      
      var scatter = [bbl];
      
      var layout = {
        title: 'Belly Button Bio-diversity',
        showlegend: false,
            // height: 600,
            // width: 600
        xaxis: {
          title: {
            text: 'OTU ID',
          }
        },
    
            yaxis: {
              title: {
                text: 'Sample Values',
              }
            }
          };
      
          Plotly.newPlot("bubble", scatter, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pie_val=data.sample_values.slice(0,10);
    var pie_lables=data.otu_ids.slice(0,10);
    var pie_hover=data.otu_labels.slice(0,10);

    console.log(pie_hover);

    var thepie = [{
      values: pie_val,
      labels: pie_lables,
      text:pie_hover,
      type: 'pie',
      hoverinfo: 'text+label+value+percent',
      textinfo:'percent'
    }];
    
    var layout = {
   
    };
    
    Plotly.newPlot('pie', thepie, layout);

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

