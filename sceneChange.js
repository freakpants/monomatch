const sceneChange = (targetScene) =>  {
    document.debug && console.log("scenechange to " + targetScene + " was triggered.");
    document.game.scene.getScene('backgroundanduiscene').events.emit("sceneChange", targetScene);
    var command = [];
    command.push({ type: "sceneChange", scene: targetScene });
    document.air_console.broadcast(command);
};
export default sceneChange;