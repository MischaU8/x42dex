import * as ex from "excalibur";
import { loader } from "./resources";
import { MyLevel } from "./level";

// Goal is to keep main.ts small and just enough to configure the engine

const game = new ex.Engine({
  backgroundColor: ex.Color.Black,
  displayMode: ex.DisplayMode.FillScreen, // Display mode tells excalibur how to fill the window
  pointerScope: ex.PointerScope.Document,
  suppressPlayButton: true,
  scenes: {
    start: MyLevel
  },
});

let currentPointer!: ex.Vector;
let down = false;
game.input.pointers.primary.on('down', (e) => {
    currentPointer = e.worldPos;
    down = true;
});
game.input.pointers.primary.on('up', (e) => {
    down = false;
});

game.input.pointers.primary.on('move', (e) => {
    if (down) {
        // drag the camera
        const currentCameraScreen = game.screen.worldToScreenCoordinates(game.currentScene.camera.pos)
        const delta = currentCameraScreen.sub(e.screenPos).scale(1/game.currentScene.camera.zoom);
        game.currentScene.camera.pos = currentPointer.add(delta);
    }
})

game.input.pointers.primary.on('wheel', (wheelEvent) => {
    // wheel up
    // game.currentScene.camera.pos = currentPointer;
    if (wheelEvent.deltaY < 0) {
      game.currentScene.camera.zoom *= 1.05;
    } else {
      game.currentScene.camera.zoom /= 1.05;
    }
});

game.start('start', { // name of the start scene 'start'
  loader, // Optional loader (but needed for loading images/sounds)
}).then(() => {
  game.currentScene.camera.zoom = 2;
  currentPointer = game.currentScene.camera.pos;
});