// sketch.js
let currentMenu;

function preload() {
  // Load any resources or data here
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  // Set up your initial menu here
  // currentMenu = new Menu1();
  //  currentMenu = new Menu2();
  // menu1 = new Menu1();
  // menu2 = new Menu2();
  currentMenu = new HomeMenu(changeMenu);
  // currentMenu = new Menu3();
}

function draw() {
  background(240, 248, 254);
  currentMenu.display();
  // currentMenu.draw();
}

function changeMenu(menu) {

  if (menu === 'heat1D') {
    currentMenu = new Menu1(changeMenu);
  }

  if (menu === 'heat2D') {
    currentMenu = new Menu2(changeMenu);
  }

  if (menu === 'home') {
    currentMenu = new HomeMenu(changeMenu);
  }
}
