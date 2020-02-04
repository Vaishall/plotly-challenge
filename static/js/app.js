function unpack(rows, index) {
	return rows.map(function(row) {
		return row[index];
	});
}

var ids
var otu_ids
var sample_values
var otu_labels
var metadata

function init() {
	d3.json("samples.json").then(function(data) {
		//console.log(data);
		ids = unpack(data.samples, 'id');
		otu_ids = unpack(data.samples, 'otu_ids');
		sample_values = unpack(data.samples, 'sample_values');
		otu_labels = unpack(data.samples, 'otu_labels');
		metadata = data.metadata

		d3.select('#selDataset').selectAll('option')
		.data(ids)
		.enter()
		.append('option')
		.attr('value', function(d) {return d;})
		.text(function(d) {return d;});

		var ind = ids.indexOf('940');
		var inddata = [{'id': 940, 'otu_ids': otu_ids[ind].map(String), 'sample_values': sample_values[ind], 'otu_labels': otu_labels[ind]}];
		
		var sorted = inddata.sort((a,b) => b.sample_values - a.sample_values);
		var trace1 = {
			type: 'bar',
			x: sorted[0].sample_values.slice(0,10).reverse(),
			y: sorted[0].otu_ids.slice(0,10).map(function(d) {return `UTO + ${d}`}).reverse(),
			hovertext: sorted[0].otu_labels.slice(0,10).reverse(),
			orientation: 'h'
		};
		var layout = {}
		Plotly.newPlot('bar', [trace1], layout);

		var trace2 = {
			x: inddata[0].otu_ids,
			y: inddata[0].sample_values,
			text: inddata[0].otu_labels,
			mode: 'markers',
			marker: {
				color: inddata[0].otu_ids,
				size: inddata[0].sample_values
			},
			type: 'scatter'
		}
		var layout = {yaxis: {tick0: 0}};
		Plotly.newPlot('bubble', [trace2], layout);


		d3.select('#sample-metadata').selectAll('p')
		.data(Object.keys(metadata[ind]))
		.enter()
		.append('p')
		.text(function(d) {return `${d}: ${metadata[ind][d]}`;});
	});

	
}

function optionChanged(value) {
	var ind = ids.indexOf(value);
	var inddata = [{'id': value, 'otu_ids': otu_ids[ind].map(String), 'sample_values': sample_values[ind], 'otu_labels': otu_labels[ind]}];
	
	var sorted = inddata.sort((a,b) => b.otu_sample_values - a.sample_values); 
	var trace1 = {
		type: 'bar',
		x: sorted[0].sample_values.slice(0,10).reverse(),
		y: sorted[0].otu_ids.slice(0,10).map(function(d) {return `UTO + ${d}`}).reverse(),
		hovertext: sorted[0].otu_labels.slice(0,10).reverse(),
		orientation: 'h'
	};
	var layout = {};
	Plotly.newPlot('bar', [trace1], layout);

	var trace2 = {
		x: inddata[0].otu_ids,
		y: inddata[0].sample_values,
		text: inddata[0].otu_labels,
		mode: 'markers',
		marker: {
			color: inddata[0].otu_ids,
			size: inddata[0].sample_values
		},
		type: 'scatter'
	}
	var layout = {yaxis: {tick0: 0}};
	Plotly.newPlot('bubble', [trace2], layout);

	console.log(metadata[ind])
	d3.select('#sample-metadata').selectAll('p')
	.data(Object.keys(metadata[ind]))
	.text(function(d) {return `${d}: ${metadata[ind][d]}`;});
}

init()