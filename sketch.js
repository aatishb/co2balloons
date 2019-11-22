function sketch(parent) {
  return function( p ) { // p could be any variable name

  //let countries = ['France', 'China', 'India', 'United Kingdom', 'United States', 'Chad', 'Qatar', 'Democratic Republic of Congo'];
  //let countries = ['China', 'India', 'United Kingdom', 'United States'];
  //let countries = ['Qatar', 'Trinidad and Tobago', 'Kuwait', 'United Arab Emirates', 'Brunei', 'Bahrain', 'Saudi Arabia']

  let countries = parent.data;
  let year = 1800;
  let restart = parent.restart;

  let dude, dudeHeight, dudeWidth;
  let table, data = {};
  let size, fontSize, pixelToMeters;
  let paused  = true;

  p.preload = function() {
    table = p.loadTable('co-emissions-per-capita.csv', 'csv', 'header');
    // https://upload.wikimedia.org/wikipedia/commons/2/2e/Black_Man_Walking_Cartoon_Vector.svg
    dude = p.loadImage('person2.png');
  }

  p.setup = function() {
    let canvas = p.createCanvas(1200, 700);
    canvas.parent(parent.$el);

    p.frameRate(10);

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(fontSize);
    p.imageMode(p.CENTER);
    p.strokeWeight(2);

    let rows = table.getRows();

    for (let row of rows) {
      let country = row.get('Country');

      if (!(country in data)) {
        data[country] = {};
      }

      let year = row.get('Year');
      let co2 = row.getNum('CO2');

      data[country][year] = co2;
    }

    countries = countries.sort((a,b) => data[a][2017] > data[b][2017]);

    size = p.width/countries.length;
    fontSize = p.min(0.2 * size, 40);

    dudeHeight = 0.34 * dude.height;
    dudeWidth = 0.34 * dude.width;

    // say dude's height is 1.778 meters (5'10"). it's also dudeHeight pixels
    // so conversion from meters to pixels = dudeHeight / 1.778
    pixelToMeters = (dudeHeight) / 1.778;

  }

  p.draw = function() {

      if (restart !== parent.restart) {
        year = 1800;
        restart = parent.restart;
        paused = true;
      }

      if (countries !== parent.data) {
        year = 1800;
        paused = true;
        countries = parent.data;

        countries = countries.sort((a,b) => data[a][2017] > data[b][2017]);

        size = p.width/countries.length;
        fontSize = p.min(0.2 * size, 40);

        dudeHeight = 0.34 * dude.height;
        dudeWidth = 0.34 * dude.width;

        // say dude's height is 1.778 meters (5'10"). it's also dudeHeight pixels
        // so conversion from meters to pixels = dudeHeight / 1.778
        pixelToMeters = (dudeHeight) / 1.778;
      }

      p.background('#c9d1d3');

      for (let i = 0; i < countries.length; i++) {


        p.textSize(fontSize);
        p.textAlign(p.CENTER, p.CENTER);

        let country = countries[i];
        let xPos = p.map(i, -1, countries.length, 0, p.width);

        p.text(country.replace(' ','\n'), xPos, p.height - 2*fontSize);

        p.push();
        p.translate(0,0.3 * dudeHeight);

        // string
        p.line(xPos - 0.44 * dudeWidth, p.height/2, xPos, p.height/2 - 0.9 * dudeHeight);

        // dude
        p.image(dude, xPos, p.height/2, dudeWidth, dudeHeight);

        // balloon
        p.fill('#da2d2d');
        p.ellipse(xPos, p.height/2 - 0.9 * dudeHeight, balloonRadius(country, year) * pixelToMeters);
        p.fill(0);

        p.pop();

        p.textSize(1.8 * fontSize);
        p.textAlign(p.LEFT, p.TOP);
        p.text(year, 0.5 * fontSize, 0.5 * fontSize);


      }

      if (year < 2017 && !paused) {
        year++;
      }
  }

  function balloonRadius(country, year) {

    // tonnes per capita * 1000 = kg per capita
    // kg per capita / 365 = kg per person per day
    // kg per person per day / 1.784 kg/m^3 = m^3 per person per day
    let balloonVolume = 1000 * data[country][year]/(1.784 * 365);

    // R = (V / (4PI/3))^(1/3)
    let balloonRadius = p.pow(balloonVolume / (4 * p.PI/3), 1/3);

    return balloonRadius;

  }

  p.mouseClicked = function() {
    if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height)
    paused = !paused;
  }


};

}
