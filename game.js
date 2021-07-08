var canvas = document.getElementById("canvas");
var engine = new BABYLON.Engine(canvas,true);
var fps = document.getElementById("fps");

var changescene = 0;

var shark;

//SET LOADING SCENE
BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function() {
    /*
    loadingBar.style.width = 100 - scene.getWaitingItemsCount() + "%";
    loadingBar.innerHTML = 100 - scene.getWaitingItemsCount() + "%";
    */
    var bar_width = 0;
    setInterval(load,0);
    function load() {
        bar_width +=1; /*(100 - 2*scene.getWaitingItemsCount());*/
        window.document.getElementById("loadingBar").style.width = bar_width + "px";
        //window.document.getElementById("loadingBar").innerHTML = "Loading:     " + (100 - scene.getWaitingItemsCount()) + "%";
    }
}
BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function() {
    window.document.getElementById("loadingBar").style.display = "none";
}

window.addEventListener("resize", function () {
    engine.resize();
});

//MAIN MENU
var MainMenu = function () {
    engine.displayLoadingUI();
    var main_menu = new BABYLON.Scene(engine);

    var camera1 = new BABYLON.ArcRotateCamera("camera1", -Math.PI/4, Math.PI/4, 3, new BABYLON.Vector3(0, 0, 0), main_menu);
        camera1.lowerRadiusLimit = camera1.upperRadiusLimit = camera1.radius = 3;
        camera1.lowerAlphaLimit = camera1.upperAlphaLimit = camera1.alpha = null;
        camera1.setTarget(BABYLON.Vector3.Zero());
        camera1.attachControl(canvas, true);

        var anchor = new BABYLON.TransformNode("");

        // light
        var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 0, 0), main_menu);
        light.intensity = 1;
        light.groundColor = new BABYLON.Color3(1,1,1);
        light.specular = BABYLON.Color3.Black();
        light.parent=camera1;

        //Earth sphere
        var earth = BABYLON.MeshBuilder.CreateSphere("earth", {diameter: 1.5}, main_menu);
        earth.isPickable = false;
        earth.position.x = 0;
        earth.position.y = 0;
        earth.position.z = 0;

        //Fix the sphere as target
        camera1.lockedTarget= earth;
        
        //Earth texture
        var earthMaterial = new BABYLON.StandardMaterial("ground", main_menu);
        earthMaterial.diffuseTexture = new BABYLON.Texture("textures/earth.jpg", main_menu);
        earth.material = earthMaterial;

        //create a fullscreen ui for all of our GUI elements
        const guiMenu = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI",true,main_menu);
        //guiMenu.idealHeight = 720; //fit our fullscreen ui to this height

        //create the Play button
        const startBtn = BABYLON.GUI.Button.CreateSimpleButton("start", "PLAY");
        startBtn.width = 0.2;
        startBtn.height = "40px";
        startBtn.color = "white";
        startBtn.top = "-14px";
        startBtn.thickness = 0;
        startBtn.background = "red";
        startBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        guiMenu.addControl(startBtn);
        //create a title -> Game's Name
        const Title = new BABYLON.GUI.TextBlock();
        Title.text = "Animal Life";
        Title.fontFamily = "Ceviche One";
        Title.fontSize = "74px";
        Title.color = "white";
        Title.resizeToFit = true;
        Title.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        guiMenu.addControl(Title);
       
        // Create the 3D UI manager for the shpere panels
        var manager = new BABYLON.GUI.GUI3DManager(main_menu);

        var panel1 = new BABYLON.GUI.SpherePanel();
        panel1.radius = 0.80;
        panel1.position.x = 0;
        panel1.position.y = 0;
        panel1.position.z = 0;
        panel1.margin = 3.6;
        panel1.columns = 2;
        panel1.rows = 2;
        manager.addControl(panel1);
        panel1.linkToTransformNode(anchor);
    
        var panel2 = new BABYLON.GUI.SpherePanel();
        panel2.radius = 0.80;
        panel2.position.x = 0;
        panel2.position.y = 0;
        panel2.position.z = 0;
        panel2.margin = 2.8;
        manager.addControl(panel2);
        panel2.linkToTransformNode(anchor);
        
        var panel3 = new BABYLON.GUI.SpherePanel();
        panel3.radius = 0.80;
        panel3.position.x = 0;
        panel3.position.y = 0;
        panel3.position.z = 0;
        panel3.margin = 2.0;
        panel3.columns = 3;
        panel3.rows = 2;
        manager.addControl(panel3);
        panel3.linkToTransformNode(anchor);
    
        var sea_button = new BABYLON.GUI.HolographicButton();
        sea_button.position.x = 5.5;
        panel2.addControl(sea_button);
        sea_button.scaling.x = -0.1;
        sea_button.scaling.y = 0.1;
        sea_button.scaling.z = -0.1;
        sea_button.text = "SEA";
        sea_button.imageUrl = "textures/Play.png"

        var pole_button = new BABYLON.GUI.HolographicButton();
        pole_button.position.x = 5.5;
        panel1.addControl(pole_button);
        pole_button.scaling.x = -0.1;
        pole_button.scaling.y = 0.1;
        pole_button.scaling.z = -0.1;
        pole_button.text = "NORTH POLE";
        pole_button.imageUrl = "textures/Play.png"
    
        var forest_button = new BABYLON.GUI.HolographicButton();
        forest_button.position.x = 5.5;
        panel2.addControl(forest_button);
        forest_button.scaling.x = -0.1;
        forest_button.scaling.y = 0.1;
        forest_button.scaling.z = -0.1;
        forest_button.text = "FOREST";
        panel2.blockLayout = true;
        forest_button.imageUrl = "textures/Play.png"
    
        var city_button = new BABYLON.GUI.HolographicButton();
        city_button.position.x = 0.5;
        panel3.addControl(city_button);
        city_button.scaling.x = -0.1;
        city_button.scaling.y = 0.1;
        city_button.scaling.z = -0.1;
        city_button.text = "CITY";
        city_button.imageUrl = "textures/Play.png";

        sea_button.onPointerUpObservable.add(function () {
            Sea = SEA_Scene(); 
            changescene = 1;   
         });

        forest_button.onPointerUpObservable.add(function () {
            Forest = FOREST_Scene(); 
            changescene = 2;   
         });

        engine.hideLoadingUI();

        return main_menu;
}

var Menu = MainMenu();
var Sea;
var Forest;
var Lose;


var jump=0;
var walkStepsCounter = 0;
var walkBackStepsCounter = 0;
var outOfPosition = false;
var alreadyWalking = false;
var change = false;
var change_back = false;

var up_down_egg = 0;
var change_egg = false;

var countdown_game = 60;

//ID of set Interval
var counterId;

// Check if the first time call the function FOREST_Scene
var call_forest = 0;

var FOREST_Scene = function(){
    var scene = new BABYLON.Scene(engine);

    //Optimization
	var optimizerOptions = new BABYLON.SceneOptimizerOptions(60, 500);
    optimizerOptions.addOptimization(new BABYLON.ShadowsOptimization(0));
    optimizerOptions.addOptimization(new BABYLON.LensFlaresOptimization(0));
    optimizerOptions.addOptimization(new BABYLON.PostProcessesOptimization(1));
    optimizerOptions.addOptimization(new BABYLON.ParticlesOptimization(1));
    optimizerOptions.addOptimization(new BABYLON.TextureOptimization(2, 512));
    optimizerOptions.addOptimization(new BABYLON.RenderTargetsOptimization(3));

    var sceneOptimizer = new BABYLON.SceneOptimizer(scene, optimizerOptions, true, true);

    sceneOptimizer.start();

    //Enable physic for the main scene
    var gravityVector = new BABYLON.Vector3(0,-150, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);

    scene.collisionsEnabled = true;
    scene.clearColor = new BABYLON.Color3(0.5, 0.8, 0.5);
    scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

    //Optimization
	var optimizer = new BABYLON.SceneOptimizerOptions(60, 1000);
    optimizer.addOptimization(new BABYLON.ShadowsOptimization(0));
    optimizer.addOptimization(new BABYLON.LensFlaresOptimization(0));
    optimizer.addOptimization(new BABYLON.PostProcessesOptimization(1));
    optimizer.addOptimization(new BABYLON.ParticlesOptimization(1));
    optimizer.addOptimization(new BABYLON.TextureOptimization(2, 512));
    optimizer.addOptimization(new BABYLON.RenderTargetsOptimization(3));

    var sceneOptimizer = new BABYLON.SceneOptimizer(scene, optimizer, true, true);

    sceneOptimizer.start();

    //GUI
    const guiGame = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GameGui",true,scene);

    var rect1 = new BABYLON.GUI.Rectangle();
    rect1.width = "5%";
    rect1.height = "7%";
    rect1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    rect1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    rect1.paddingLeft = "-32px";
    rect1.paddingRight = "2px";
    rect1.paddingTop = "5px";
    rect1.paddingBottom = "-5px";
    rect1.background = "grey";

    var Countdown = new BABYLON.GUI.TextBlock("Countdown","60"); 
    Countdown.color = "white";
    Countdown.fontFamily = "Courier";
    Countdown.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    Countdown.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    Countdown.paddingLeft = "-32px";
    Countdown.paddingRight = "32px";
    Countdown.paddingTop = "5px";
    Countdown.paddingBottom = "-5px";
    Countdown.fontSize = 50;

    guiGame.addControl(rect1);
    rect1.addControl(Countdown);

    if(call_forest == 0){
        counterId = setInterval(() => {
            if(countdown_game != 0){ 
                countdown_game--;
                Countdown.text = String(countdown_game);
            }
        }, 1000);
        call_forest++;
    }

    console.log(counterId);

    Countdown.onTextChangedObservable.add(function () {
        if(countdown_game == 0){
            clearInterval(counterId);
            Lose = LOSING_Scene();
            changescene = 3;
        }   
    });
    

    // SKYBOX
	var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/forest", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skybox.material = skyboxMaterial;		
    
	//Defininng the scene camera
	var camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 34, new BABYLON.Vector3(0, 0, 60), scene);
    scene.activeCamera = camera;
    scene.activeCamera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 15;
    //camera.upperRadiusLimit = 180;
    camera.wheelDeltaPercentage = 0.003;
    //camera.ellipsoid = new BABYLON.Vector3(5, 5, 5);
    //camera.checkCollisions = true;
    camera.lowerBetaLimit = Math.PI / 8;	//up
    camera.upperBetaLimit = Math.PI / 2.15;	//down

    //Defining the scene lights
	var directionalLight =  new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(10, -200, 0), scene);
    directionalLight.diffuse = new BABYLON.Color3(1, 1, 1);
    directionalLight.specular = new BABYLON.Color3(1, 1, 1);
    directionalLight.intensity = 0.9;
    directionalLight.excludedMeshes.push(skybox);
    var hemisphericLight = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 0, 1), scene);

    //SHADOW GENERATOR
    var shadowGenerator = new BABYLON.ShadowGenerator(2048, directionalLight);
    shadowGenerator.useExponenetialShadowMap = true;

    //Difining the grounds
    var ground = BABYLON.MeshBuilder.CreateGround("myGround", {width: 1000, height: 1000, subdivisions: 4}, scene);
    var groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
  
    groundMaterial.diffuseTexture = new BABYLON.Texture("textures/grass2.jpg", scene);
    groundMaterial.diffuseTexture.uScale = 8;
    groundMaterial.diffuseTexture.vScale = 8;
    groundMaterial.specularTexture = new BABYLON.Texture("textures/grass2.jpg", scene);
    groundMaterial.specularTexture.uScale = 8;
    groundMaterial.specularTexture.vScale = 8;

    ground.material = groundMaterial;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
    ground.checkCollisions = true;
    ground.receiveShadows = true;


    const fountainProfile = [
		new BABYLON.Vector3(0, 0, 0),
		new BABYLON.Vector3(10, 0, 0),
        new BABYLON.Vector3(10, 4, 0),
		new BABYLON.Vector3(8, 4, 0),
        new BABYLON.Vector3(8, 1, 0),
        new BABYLON.Vector3(1, 2, 0),
		new BABYLON.Vector3(1, 15, 0),
		new BABYLON.Vector3(3, 17, 0)
	];
	
	//Create lathe
	const fountain = BABYLON.MeshBuilder.CreateLathe("fountain", {shape: fountainProfile, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
	//fountain.position.y = 26;
    fountain.position.x = 250;
    fountain.scaling = new BABYLON.Vector3(3,3,3);
    fountain.showBoundingBox = true;
    fountain.physicsImpostor = new BABYLON.PhysicsImpostor(fountain, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);
    shadowGenerator.addShadowCaster(fountain);
    

    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem("particles", 50000, scene);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);

    // Where the particles come from
    particleSystem.emitter = new BABYLON.Vector3(250, 50, 0); // the starting object, the emitter
    particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

    // Colors of all particles
    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    // Size of each particle (random between...
    particleSystem.minSize = 1;
    particleSystem.maxSize = 2;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 2;
    particleSystem.maxLifeTime = 3.5;

    // Emission rate
    particleSystem.emitRate = 1000;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(-2, 8, 2);
    particleSystem.direction2 = new BABYLON.Vector3(2, 8, -2);

    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // Speed
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.updateSpeed = 0.025;

    particleSystem.start();

    var rockTask;

    //ADD ROCK
    BABYLON.SceneLoader.ImportMesh("", "models/", "rock.obj", scene, function (newMeshes, particleSystems, skeletons) {
        // Only one mesh here
        rockTask = newMeshes[0];
        rockTask.position.x = 90;
        rockTask.position.z = 90

        rockTask.scaling.scaleInPlace(3);

        //const displacementmapURL = "textures/distortion.jpeg";
        //rockTask.applyDisplacementMap(displacementmapURL, 0.1, 1);

        var rockMaterial = new BABYLON.StandardMaterial("rock_mat", scene);
        rockMaterial.diffuseColor = new BABYLON.Vector3(0.3,0.3,0.3);
        rockMaterial.specularColor = new BABYLON.Vector3(0.5,0.5,0.5);
        //rockMaterial.disableLighting = true;
	    //rockMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/rock.png", scene);
	    //rockMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

        rockTask.material=rockMaterial;

        rockTask.showBoundingBox = true;

        rockTask.physicsImpostor = new BABYLON.PhysicsImpostor(rockTask, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 150, restitution: 0});
        rockTask.physicsImpostor.physicsBody.inertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertiaWorld.setZero();

    });


    var perimeter_scene = [];
	const Walls = BABYLON.Mesh.CreateBox("Walls", 2, scene);
		hemisphericLight.excludedMeshes.push(Walls);
		directionalLight.excludedMeshes.push(Walls);
		Walls.setEnabled(false);

        var wall_material = new BABYLON.StandardMaterial("wall_mat",scene);
        wall_material.alpha = 0;

        var Wall1 = Walls.clone();
        Wall1.position = new BABYLON.Vector3(150, 80, 150);
        Wall1.scaling = new BABYLON.Vector3(80, 80, 10);
        Wall1.rotation = new BABYLON.Vector3(0, Math.PI/4 , 0);
        hemisphericLight.excludedMeshes.push(Wall1);
        directionalLight.excludedMeshes.push(Wall1);
        Wall1.physicsImpostor = new BABYLON.PhysicsImpostor(Wall1, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        Wall1.physicsImpostor.physicsBody.inertia.setZero();
        Wall1.physicsImpostor.physicsBody.invInertia.setZero();
        Wall1.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        Wall1.freezeWorldMatrix();
        Wall1.convertToUnIndexedMesh();
        Wall1.setEnabled(true);
        Wall1.showBoundingBox = true;
        //Wall_2.visibility = 0;
        Wall1.checkCollisions = true;
        Wall1.material = wall_material;
    perimeter_scene.push(Wall1);

        var Wall2 = Walls.clone();
        Wall2.position = new BABYLON.Vector3(-150, 80, 150);
        Wall2.scaling = new BABYLON.Vector3(80, 80,10);
        Wall2.rotation = new BABYLON.Vector3(0, -Math.PI/4, 0);
        hemisphericLight.excludedMeshes.push(Wall2);
        directionalLight.excludedMeshes.push(Wall2);
        Wall2.physicsImpostor = new BABYLON.PhysicsImpostor(Wall2, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        Wall2.physicsImpostor.physicsBody.inertia.setZero();
        Wall2.physicsImpostor.physicsBody.invInertia.setZero();
        Wall2.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        Wall2.freezeWorldMatrix();
        Wall2.convertToUnIndexedMesh();
        Wall2.setEnabled(true);
        //Wall_1.visibility = 0;
        Wall2.showBoundingBox = true;
        Wall2.checkCollisions = true;
        Wall2.material = wall_material;
    perimeter_scene.push(Wall2); 

    var Wall3 = Walls.clone();
        Wall3.position = new BABYLON.Vector3(-150, 80, -150);
        Wall3.scaling = new BABYLON.Vector3(80, 80, 10);
        Wall3.rotation = new BABYLON.Vector3(0, Math.PI/4, 0);
        hemisphericLight.excludedMeshes.push(Wall3);
        directionalLight.excludedMeshes.push(Wall3);
        Wall3.physicsImpostor = new BABYLON.PhysicsImpostor(Wall3, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        Wall3.physicsImpostor.physicsBody.inertia.setZero();
        Wall3.physicsImpostor.physicsBody.invInertia.setZero();
        Wall3.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        Wall3.freezeWorldMatrix();
        Wall3.convertToUnIndexedMesh();
        Wall3.setEnabled(true);
        Wall3.showBoundingBox = true;
        //Wall3.visibility = 0;
        Wall3.checkCollisions = true;
        Wall3.material = wall_material;
    perimeter_scene.push(Wall3);

    var Wall4 = Walls.clone();
        Wall4.position = new BABYLON.Vector3(150, 80, -150);
        Wall4.diffuseColor = new BABYLON.Vector3(1, 0, 1);
        Wall4.scaling = new BABYLON.Vector3(80, 80, 10);
        Wall4.rotation = new BABYLON.Vector3(0, -Math.PI/4, 0);
        //hemisphericLight.excludedMeshes.push(Wall4);
        //directionalLight.excludedMeshes.push(Wall4);
        Wall4.physicsImpostor = new BABYLON.PhysicsImpostor(Wall4, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        Wall4.physicsImpostor.physicsBody.inertia.setZero();
        Wall4.physicsImpostor.physicsBody.invInertia.setZero();
        Wall4.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        Wall4.freezeWorldMatrix();
        Wall4.convertToUnIndexedMesh();
        Wall4.setEnabled(true);
        Wall4.showBoundingBox = true;
        //Wall4.visibility = 0;
        Wall4.checkCollisions = true;
        Wall4.material = wall_material;
    perimeter_scene.push(Wall4);

    var Wall5 = Walls.clone();
        Wall5.position = new BABYLON.Vector3(-80, 80, -260);
        Wall5.scaling = new BABYLON.Vector3(60, 80, 10);
        Wall5.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
        hemisphericLight.excludedMeshes.push(Wall5);
        directionalLight.excludedMeshes.push(Wall5);
        Wall5.physicsImpostor = new BABYLON.PhysicsImpostor(Wall5, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        Wall5.physicsImpostor.physicsBody.inertia.setZero();
        Wall5.physicsImpostor.physicsBody.invInertia.setZero();
        Wall5.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        Wall5.freezeWorldMatrix();
        Wall5.convertToUnIndexedMesh();
        Wall5.setEnabled(true);
        //Wall5.visibility = 0;
        Wall5.checkCollisions = true;
        Wall5.showBoundingBox = true;
        Wall5.material = wall_material;
    perimeter_scene.push(Wall5);

    var Wall6 = Walls.clone();
        Wall6.position = new BABYLON.Vector3(0, 80, -330);
        Wall6.scaling = new BABYLON.Vector3(80, 80, 10);
        Wall6.rotation = new BABYLON.Vector3(0, 0, 0);
        hemisphericLight.excludedMeshes.push(Wall6);
        directionalLight.excludedMeshes.push(Wall6);
        Wall6.physicsImpostor = new BABYLON.PhysicsImpostor(Wall6, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        Wall6.physicsImpostor.physicsBody.inertia.setZero();
        Wall6.physicsImpostor.physicsBody.invInertia.setZero();
        Wall6.physicsImpostor.physicsBody.invInertiaWorld.setZero(); 
        Wall6.freezeWorldMatrix();
        Wall6.convertToUnIndexedMesh();
        Wall6.setEnabled(true);
        Wall6.showBoundingBox = true;
        //Wall6.visibility = 0;
        Wall6.checkCollisions = true;
        Wall6.material = wall_material;
    perimeter_scene.push(Wall6);

    var Wall7 = Walls.clone();
        Wall7.position = new BABYLON.Vector3(80, 80, -260);
        Wall7.scaling = new BABYLON.Vector3(60, 80, 10);
        Wall7.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
        hemisphericLight.excludedMeshes.push(Wall7);
        directionalLight.excludedMeshes.push(Wall7);
        Wall7.physicsImpostor = new BABYLON.PhysicsImpostor(Wall7, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        Wall7.physicsImpostor.physicsBody.inertia.setZero();
        Wall7.physicsImpostor.physicsBody.invInertia.setZero();
        Wall7.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        Wall7.freezeWorldMatrix();
        Wall7.convertToUnIndexedMesh();
        Wall7.setEnabled(true);
        Wall7.showBoundingBox = true;
        //Wall7.visibility = 0;
        Wall7.checkCollisions = true;
        Wall7.material = wall_material;
    perimeter_scene.push(Wall7);

    var Wall8 = Walls.clone();
        Wall8.position = new BABYLON.Vector3(280, 80, -74);
        Wall8.scaling = new BABYLON.Vector3(80, 80, 10);
        Wall8.rotation = new BABYLON.Vector3(0, 0, 0);
        hemisphericLight.excludedMeshes.push(Wall8);
        directionalLight.excludedMeshes.push(Wall8);
        Wall8.physicsImpostor = new BABYLON.PhysicsImpostor(Wall8, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        Wall8.physicsImpostor.physicsBody.inertia.setZero();
        Wall8.physicsImpostor.physicsBody.invInertia.setZero();
        Wall8.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        Wall8.freezeWorldMatrix();
        Wall8.convertToUnIndexedMesh();
        Wall8.setEnabled(true);
        Wall8.showBoundingBox = true;
        //Wall8.visibility = 0;
        Wall8.checkCollisions = true;
        Wall8.material = wall_material;
    perimeter_scene.push(Wall8);

    var Wall9 = Walls.clone();
        Wall9.position = new BABYLON.Vector3(370, 80, 0);
        Wall9.scaling = new BABYLON.Vector3(89, 80, 10);
        Wall9.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
        hemisphericLight.excludedMeshes.push(Wall9);
        directionalLight.excludedMeshes.push(Wall9);
        Wall9.physicsImpostor = new BABYLON.PhysicsImpostor(Wall9, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        Wall9.physicsImpostor.physicsBody.inertia.setZero();
        Wall9.physicsImpostor.physicsBody.invInertia.setZero();
        Wall9.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        Wall9.freezeWorldMatrix();
        Wall9.convertToUnIndexedMesh();
        Wall9.setEnabled(true);
        Wall9.showBoundingBox = true;
        //Wall9.visibility = 0;
        Wall9.checkCollisions = true;
        Wall9.material = wall_material;
    perimeter_scene.push(Wall9);

    var Wall10 = Walls.clone();
        Wall10.position = new BABYLON.Vector3(280, 80, 74);
        Wall10.scaling = new BABYLON.Vector3(80, 80, 10);
        Wall10.rotation = new BABYLON.Vector3(0, 0, 0);
        hemisphericLight.excludedMeshes.push(Wall10);
        directionalLight.excludedMeshes.push(Wall10);
        Wall10.physicsImpostor = new BABYLON.PhysicsImpostor(Wall10, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        Wall10.physicsImpostor.physicsBody.inertia.setZero();
        Wall10.physicsImpostor.physicsBody.invInertia.setZero();
        Wall10.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        Wall10.freezeWorldMatrix();
        Wall10.convertToUnIndexedMesh();
        Wall10.setEnabled(true);
        Wall10.showBoundingBox = true;
        //Wall10.visibility = 0;
        Wall10.checkCollisions = true;
        Wall10.material = wall_material;
    perimeter_scene.push(Wall10);

    var Wall11 = Walls.clone();
        Wall11.position = new BABYLON.Vector3(-210, 80, 0);
        Wall11.scaling = new BABYLON.Vector3(85, 80, 10);
        Wall11.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
        hemisphericLight.excludedMeshes.push(Wall11);
        directionalLight.excludedMeshes.push(Wall11);
        Wall11.physicsImpostor = new BABYLON.PhysicsImpostor(Wall11, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        Wall11.physicsImpostor.physicsBody.inertia.setZero();
        Wall11.physicsImpostor.physicsBody.invInertia.setZero();
        Wall11.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        Wall11.freezeWorldMatrix();
        Wall11.convertToUnIndexedMesh();
        Wall11.setEnabled(true);
        Wall11.showBoundingBox = true;
        //Wall11.visibility = 0;
        Wall11.checkCollisions = true;
        Wall11.material = wall_material;
    perimeter_scene.push(Wall11);

    var Wall12 = Walls.clone();
        Wall12.position = new BABYLON.Vector3(0, 80, 210);
        Wall12.scaling = new BABYLON.Vector3(85, 80, 10);
        Wall12.rotation = new BABYLON.Vector3(0, 0, 0);
        hemisphericLight.excludedMeshes.push(Wall12);
        directionalLight.excludedMeshes.push(Wall12);
        Wall12.physicsImpostor = new BABYLON.PhysicsImpostor(Wall12, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
        Wall12.physicsImpostor.physicsBody.inertia.setZero();
        Wall12.physicsImpostor.physicsBody.invInertia.setZero();
        Wall12.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        Wall12.freezeWorldMatrix();
        Wall12.convertToUnIndexedMesh();
        Wall12.setEnabled(true);
        Wall12.showBoundingBox = true;
        //Wall12.visibility = 0;
        Wall12.checkCollisions = true;
        Wall12.material = wall_material;
    perimeter_scene.push(Wall12);


  /*   //LOAD TREE
    BABYLON.SceneLoader.ImportMesh("", "//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (newMeshes) {
        var tree = newMeshes[0];
        tree.material.opacityTexture = null;
        tree.material.backFaceCulling = false;
        tree.scaling.x = 150;
        tree.scaling.z = 150;
        tree.scaling.y = 150;
         
       
    }); */

    var tree = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        var tree = meshes[0];
        tree.scaling = new BABYLON.Vector3(600, 600, 600);
        tree.position = new BABYLON.Vector3(0, 0, 0);
        tree.showBoundingBox;
        tree.material.opacityTexture = null;
        tree.material.backFaceCulling = false;
    
        var tree1 = tree.createInstance("");
        tree1.position.x = -200;
        tree1.position.z = 400;
        shadowGenerator.addShadowCaster(tree1);
    
        var tree2 = tree.createInstance("");
        tree2.position.x = 300;
        tree2.position.z = 270;
        shadowGenerator.addShadowCaster(tree2);
     
        var tree3 = tree.createInstance("");
        tree3.position.x = -200;
        tree3.position.z = 260;
        shadowGenerator.addShadowCaster(tree3);
        
        var tree4 = tree.createInstance("");
        tree4.position.x = 190;
        tree4.position.z = -200;
        shadowGenerator.addShadowCaster(tree4);

        var tree5 = tree.createInstance("");
        tree5.position.x = 350;
        tree5.position.z = 450;
        shadowGenerator.addShadowCaster(tree5);

        var tree6 = tree.createInstance("");
        tree6.position.x = 200;
        tree6.position.z = 150; 
        shadowGenerator.addShadowCaster(tree6);

        var tree7 = tree.createInstance("");
        tree7.position.x = 400;
        tree7.position.z = 200;
        shadowGenerator.addShadowCaster(tree7);
        
        var tree8 = tree.createInstance("");
        tree8.position.x = 0;
        tree8.position.z = -425;
        shadowGenerator.addShadowCaster(tree8);

        var tree9 = tree.createInstance("");
        tree9.position.x = -400;
        tree9.position.z = 30;
        shadowGenerator.addShadowCaster(tree9);

        var tree10 = tree.createInstance("");
        tree10.position.x = -350;
        tree10.position.z = 100;
        shadowGenerator.addShadowCaster(tree10);

        var tree11 = tree.createInstance("");
        tree11.position.x = -450;
        tree11.position.z = 300;
        shadowGenerator.addShadowCaster(tree11);
        
        var tree12 = tree.createInstance("");
        tree12.position.x = -390;
        tree12.position.z = -60;
        shadowGenerator.addShadowCaster(tree12);
        
        var tree13 = tree.createInstance("");
        tree13.position.x = -350;
        tree13.position.z = -300;
        shadowGenerator.addShadowCaster(tree13);

        var tree14 = tree.createInstance("");
        tree14.position.x = 270;
        tree14.position.z = -190;
        shadowGenerator.addShadowCaster(tree14);
        
        var tree15 = tree.createInstance("");
        tree15.position.x = 350;
        tree15.position.z = -100;
        shadowGenerator.addShadowCaster(tree15);

        tree.isVisible = false;
    });

    // KEYBOARD INPUT
    var map = {};
	scene.actionManager = new BABYLON.ActionManager(scene);

	scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
		map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
	}));
	scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
		map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
	}));

    // IMPORT OF THE ELF

    var ElfBoundingBox = BABYLON.MeshBuilder.CreateBox("ElfBoundingBox",{ height: 7.0, width: 10, depth: 20 }, scene);
		ElfBoundingBox.position.y = 3.5;
	var ElfBoundingBoxMaterial = new BABYLON.StandardMaterial("ElfBoundingBoxMaterial", scene);
		ElfBoundingBoxMaterial.alpha = 0;
		ElfBoundingBox.material = ElfBoundingBoxMaterial;

    // Add the highlight layer.
    var hl = new BABYLON.HighlightLayer("hl1", scene);


    //ADD EGGS  
    var egg;
    BABYLON.SceneLoader.ImportMesh("", "models/", "egg.obj", scene, function (newMeshes, particleSystems, skeletons) {
        egg = newMeshes[0];
        egg.position.y = 5;
        egg.position.x = 320;
        egg.scaling.scaleInPlace(2);

        hl.addMesh(egg, BABYLON.Color3.Yellow());
        egg.showBoundingBox = true;

        console.log("new meshes egg imported:", newMeshes);

        var egg2 = egg.createInstance("");
        egg2.position.x = 95;
        egg2.position.z = 90;
        egg2.position.y = 40;

        scene.registerBeforeRender(function () {
            if(up_down_egg>50){
                change_egg = true;
            }else if(up_down_egg<0){
                change_egg = false;
            }
            if(!change_egg){
                egg.position.y += 0.1;
                egg2.position.x += 0.2;
                up_down_egg++;
            }else{
                egg.position.y -= 0.1;
                egg2.position.x -= 0.2;
                up_down_egg--;
            }
            //egg1.rotate(BABYLON.Axis.Z, 0.01, BABYLON.Space.LOCAL);
        });

    });

    //ADD TRONCO
    BABYLON.SceneLoader.ImportMesh("", "models/", "tronco.obj", scene, function (newMeshes) {
        // Only one mesh here
        var tronco = newMeshes[0];
        tronco.position.x = 10;
        tronco.position.z = 10;
        tronco.position.y = 20;

        tronco.scaling.scaleInPlace(6);
    });

    /*
    BABYLON.SceneLoader.ImportMesh("", "models/Elf/", "Elf.gltf", scene, function (newMeshes, particleSystems, skeletons) {

        console.log("new meshes imported:", newMeshes);
        elf=newMeshes[0];
        elf.scaling.scaleInPlace(10);
		elf.position.y = 4;

        elf_skeleton = skeletons[0];
        console.log("skeleton imported:", elf_skeleton);

        elf.parent = ElfBoundingBox;
        ElfBoundingBox.showBoundingBox = true;

        var elfMaterial = new BABYLON.StandardMaterial("elf_material", scene);
        elfMaterial.diffuseTexture = new BABYLON.Texture("textures/earth.jpg", scene);
        newMeshes[1].material=elfMaterial;

        ElfBoundingBox.physicsImpostor = new BABYLON.PhysicsImpostor(ElfBoundingBox, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 60, restitution: 0});
		ElfBoundingBox.physicsImpostor.physicsBody.inertia.setZero();
		ElfBoundingBox.physicsImpostor.physicsBody.invInertia.setZero();
		ElfBoundingBox.physicsImpostor.physicsBody.invInertiaWorld.setZero();


		camera.target = ElfBoundingBox;

        // DEBUGGIN SKELETON VIEWE
		var skeletonViewer = new BABYLON.Debug.SkeletonViewer(elf_skeleton, elf, scene);
		skeletonViewer.isEnabled = true; // Enable it
		skeletonViewer.color = BABYLON.Color3.Red(); // Change default color from white to red

        for(i=0;i<22;i++){
            elf_skeleton.bones[i].linkTransformNode(null); 
        }
        //elf_skeleton.bones[11].linkTransformNode(null);
        //BONES[10] = RIGHT SHOULDER
        //BONES[11] = RIGHT ARM

        scene.debugLayer.show({
            embedMode:true
        });

        scene.registerBeforeRender(function () {
			var dir = camera.getTarget().subtract(camera.position);
				dir.y = -ElfBoundingBox.getDirection(new BABYLON.Vector3(0, 0, 1)).y;
				dir.z = dir.z;
				dir.x = dir.x;
                if(clicked){
                    //ElfBoundingBox.setDirection(dir);
                    if(!alreadyWalking){
                        walkForward(walk_speed);
                        alreadyWalking = true;
                    }
                    if(!outOfPosition){
                        outOfPosition = true;
                    }
                }
                ElfBoundingBox.physicsImpostor.registerOnPhysicsCollide(ground.physicsImpostor, function() {
                    jump = 0;
                    
                });
        });

    });*/

    var RexBoundingBox = BABYLON.MeshBuilder.CreateBox("RexBoundingBox",{ height: 7.0, width: 10, depth: 35 }, scene);
		RexBoundingBox.position.y = 3.5;
	var RexBoundingBoxMaterial = new BABYLON.StandardMaterial("RexBoundingBoxMaterial", scene);
		RexBoundingBoxMaterial.alpha = 0;
		RexBoundingBox.material = RexBoundingBoxMaterial;

    var rex;
    var rex_skeleton;

    BABYLON.SceneLoader.ImportMesh("", "models/Trex/", "trex.gltf", scene, function (newMeshes, particleSystems, skeletons) {

        console.log("new meshes imported:", newMeshes);
        rex=newMeshes[0];
        rex.scaling.scaleInPlace(5);
		rex.position.y = -0.2;

        shadowGenerator.addShadowCaster(rex);

        rex_skeleton = skeletons[0];
        console.log("skeleton imported:", rex_skeleton);

        rex.parent = RexBoundingBox;
        RexBoundingBox.showBoundingBox = true;

        /*
        newMeshes[1].showBoundingBox = true;

        RexBoundingBox.physicsImpostor = new BABYLON.PhysicsImpostor(RexBoundingBox, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 60, restitution: 0});
		RexBoundingBox.physicsImpostor.physicsBody.inertia.setZero();
		RexBoundingBox.physicsImpostor.physicsBody.invInertia.setZero();
		RexBoundingBox.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        */

        RexBoundingBox.physicsImpostor = new BABYLON.PhysicsImpostor(RexBoundingBox, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 60, restitution: 0});
		RexBoundingBox.physicsImpostor.physicsBody.inertia.setZero();
		RexBoundingBox.physicsImpostor.physicsBody.invInertia.setZero();
		RexBoundingBox.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        //scene.stopAllAnimations();

		camera.target = RexBoundingBox;

        // DEBUGGIN SKELETON VIEWER
        /*
		var skeletonViewer = new BABYLON.Debug.SkeletonViewer(rex_skeleton, rex, scene);
		skeletonViewer.isEnabled = true; // Enable it
		skeletonViewer.color = BABYLON.Color3.Red(); // Change default color from white to red
        */

        for(i=0;i<72;i++){
            rex_skeleton.bones[i].linkTransformNode(null); 
        }
       
        /* INSPECTOR
        scene.debugLayer.show({
            embedMode:true
        });
        */

        rex_skeleton.bones[42].rotate(BABYLON.Axis.Z, 150, BABYLON.Space.LOCAL);  //Left Up Leg
        rex_skeleton.bones[53].rotate(BABYLON.Axis.Z, -150, BABYLON.Space.LOCAL); //Right Up Leg

        scene.registerBeforeRender(function () {
			var dir = camera.getTarget().subtract(camera.position);
				dir.y = -RexBoundingBox.getDirection(new BABYLON.Vector3(0, 0, 1)).y;
				dir.z = dir.z;
				dir.x = dir.x;
                //if(clicked){
                    RexBoundingBox.setDirection(dir);
                    //if(!alreadyWalking){
                    //    walkForward(walk_speed);
                    //    alreadyWalking = true;
                    //}
                    //if(!outOfPosition){
                    //    outOfPosition = true;
                    //}
                //}
                RexBoundingBox.physicsImpostor.registerOnPhysicsCollide(ground.physicsImpostor, function() {
                    jump = 0;
                });

                RexBoundingBox.physicsImpostor.registerOnPhysicsCollide(rockTask.physicsImpostor, function() {
                    jump = 0;
                });
                
        });

    });

	var walkForward = function(speed){
        if(walkStepsCounter>30){
            change = true;
        }else if(walkStepsCounter<-30){
            change = false;
        }
        if(!change){ //Va 

            //Face
            rex_skeleton.bones[7].rotate(BABYLON.Axis.Y, speed/50, BABYLON.Space.LOCAL); 

            //ARMS
            rex_skeleton.bones[33].rotate(BABYLON.Axis.X, speed/50, BABYLON.Space.LOCAL); //Right Arm
            rex_skeleton.bones[25].rotate(BABYLON.Axis.X, -speed/50, BABYLON.Space.LOCAL); //Left Arm


            //LEGS
            rex_skeleton.bones[42].rotate(BABYLON.Axis.Z, -speed/90, BABYLON.Space.LOCAL);  //Left Up Leg
            rex_skeleton.bones[53].rotate(BABYLON.Axis.Z, speed/90, BABYLON.Space.LOCAL);  //Right Up Leg

            //FOOT
            rex_skeleton.bones[44].rotate(BABYLON.Axis.Z, -speed/80, BABYLON.Space.LOCAL);  //Left Foot
            rex_skeleton.bones[55].rotate(BABYLON.Axis.Z, -speed/80, BABYLON.Space.LOCAL);  //Right Foot

            //TAILS
            rex_skeleton.bones[64].rotate(BABYLON.Axis.Y, speed/60, BABYLON.Space.LOCAL);  // Tail

            walkStepsCounter ++;
        }else{

            //Face
            rex_skeleton.bones[7].rotate(BABYLON.Axis.Y, -speed/50, BABYLON.Space.LOCAL);

            //ARMS
            rex_skeleton.bones[33].rotate(BABYLON.Axis.X, -speed/50, BABYLON.Space.LOCAL); //Right Arm
            rex_skeleton.bones[25].rotate(BABYLON.Axis.X, speed/50, BABYLON.Space.LOCAL); //Left Arm
            
            //LEGS
            rex_skeleton.bones[42].rotate(BABYLON.Axis.Z, speed/90, BABYLON.Space.LOCAL);  //Left Up Leg
            rex_skeleton.bones[53].rotate(BABYLON.Axis.Z, -speed/90, BABYLON.Space.LOCAL);  //Right Up Leg

            //FOOT
            rex_skeleton.bones[44].rotate(BABYLON.Axis.Z, speed/80, BABYLON.Space.LOCAL);  //Left Foot
            rex_skeleton.bones[55].rotate(BABYLON.Axis.Z, speed/80, BABYLON.Space.LOCAL);  //Right Foot

            //TAILS
            rex_skeleton.bones[64].rotate(BABYLON.Axis.Y, -speed/60, BABYLON.Space.LOCAL);  // Tail

            walkStepsCounter = walkStepsCounter-1;
        }
        console.log(walkStepsCounter);
	};
    var walkBack = function(speed){
        if(walkBackStepsCounter>20){
            change_back = true;
        }else if(walkBackStepsCounter<-20){
            change_back = false;
        }
        if(!change_back){

            //LEGS
            rex_skeleton.bones[42].rotate(BABYLON.Axis.Z, speed/90, BABYLON.Space.LOCAL);  //Left Up Leg
            rex_skeleton.bones[53].rotate(BABYLON.Axis.Z, -speed/90, BABYLON.Space.LOCAL);  //Right Up Leg

            //FOOT
            rex_skeleton.bones[44].rotate(BABYLON.Axis.Z, -speed/80, BABYLON.Space.LOCAL);  //Left Foot
            rex_skeleton.bones[55].rotate(BABYLON.Axis.Z, -speed/80, BABYLON.Space.LOCAL);  //Right Foot

            //TAILS
            //rex_skeleton.bones[64].rotate(BABYLON.Axis.Y, speed/20, BABYLON.Space.LOCAL);  // Tail

            walkBackStepsCounter ++;
        }else{
            
            //LEGS
            rex_skeleton.bones[42].rotate(BABYLON.Axis.Z, -speed/90, BABYLON.Space.LOCAL);  //Left Up Leg
            rex_skeleton.bones[53].rotate(BABYLON.Axis.Z, speed/90, BABYLON.Space.LOCAL);  //Right Up Leg

            //FOOT
            rex_skeleton.bones[44].rotate(BABYLON.Axis.Z, speed/80, BABYLON.Space.LOCAL);  //Left Foot
            rex_skeleton.bones[55].rotate(BABYLON.Axis.Z, speed/80, BABYLON.Space.LOCAL);  //Right Foot

            //TAILS
            //rex_skeleton.bones[64].rotate(BABYLON.Axis.Y, -speed/20, BABYLON.Space.LOCAL);  // Tail

            walkBackStepsCounter = walkBackStepsCounter-1;
        }
        console.log(walkBackStepsCounter);
	};
    var walk_speed = 1.5;

    //WALK
    scene.registerAfterRender(function () {
		if ((map["w"] || map["W"])) {
			RexBoundingBox.translate(BABYLON.Axis.Z, walk_speed, BABYLON.Space.LOCAL);
			//if(!alreadyWalking){
				walkForward(walk_speed);
			//	alreadyWalking = true;
			//}
			//if(!outOfPosition){
			//	outOfPosition = true;
			//}
		}
		if ((map["s"] || map["S"])) {
			RexBoundingBox.translate(BABYLON.Axis.Z, -walk_speed, BABYLON.Space.LOCAL);
            //if(!alreadyWalking){
				walkBack(walk_speed);
				//alreadyWalking = true;
			//}
			//if(!outOfPosition){
			//	outOfPosition = true;
			//}
		}
		if ((map["a"] || map["A"])) {
			RexBoundingBox.translate(BABYLON.Axis.X, -walk_speed, BABYLON.Space.LOCAL);
            if(!alreadyWalking){
				walkForward(walk_speed);
				alreadyWalking = true;
			}
			if(!outOfPosition){
				outOfPosition = true;
			}
		}
		if ((map["d"] || map["D"])) {
			RexBoundingBox.translate(BABYLON.Axis.X, walk_speed, BABYLON.Space.LOCAL);
            if(!alreadyWalking){
				walkForward(walk_speed);
				alreadyWalking = true;
			}
			if(!outOfPosition){
				outOfPosition = true;
			}
		}
        if (map[" "] && jump == 0){
            RexBoundingBox.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 5000, 0), RexBoundingBox.getAbsolutePosition());
            jump=1;
        }
    });
    
    

    return scene;
}

var LOSING_Scene = function(){
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI/4, Math.PI/4, 3, new BABYLON.Vector3(0, 0, 0), scene);
    camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius = 3;
    camera.lowerAlphaLimit = camera.upperAlphaLimit = camera.alpha = null;
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    var loseGui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var Lose = new BABYLON.GUI.TextBlock("Lose","YOU LOSE"); 
    Lose.color = "white";
    Lose.fontFamily = "Courier";
    //Lose.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    Lose.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    Lose.fontSize = "74px";
    Lose.paddingLeft = "-32px";
    Lose.paddingRight = "32px";
    Lose.paddingTop = "5px";
    Lose.paddingBottom = "-5px";
    Lose.resizeToFit = true;

    var rect1 = new BABYLON.GUI.Rectangle();
    rect1.width = "70%";
    rect1.height = "70%";
    rect1.paddingLeft = "-32px";
    rect1.paddingRight = "2px";
    rect1.paddingTop = "5px";
    rect1.paddingBottom = "-5px";
    rect1.background = "black";

    const restartBtn = BABYLON.GUI.Button.CreateSimpleButton("restart", "RESTART");
    restartBtn.width = 0.2;
    restartBtn.height = 0.2;
    //restartBtn.height = "40px";
    restartBtn.color = "black";
    restartBtn.top = "-14px";
    restartBtn.fontSize = 50;
    restartBtn.thickness = 0;
    restartBtn.background = "white";
    restartBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    rect1.addControl(restartBtn);


    loseGui.addControl(rect1);
    loseGui.addControl(Lose);

    restartBtn.onPointerUpObservable.addOnce(function () {
        jump=0;
        walkStepsCounter = 0;
        walkBackStepsCounter = 0;
        outOfPosition = false;
        alreadyWalking = false;
        change = false;
        change_back = false;

        console.log("clickedRestart");

        up_down_egg = 0;
        change_egg = false;

        countdown_game = 60;

        // Check if the first time call the function FOREST_Scene
        call_forest = 0;
        Forest = FOREST_Scene(); 
        changescene = 2;   
    });

    return scene;
}

var SEA_Scene = function(){

    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0, -9.0, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin)
 
    /*
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2,  Math.PI / 1.2, 15, BABYLON.Vector3.Zero(), scene);
    camera.upperBetaLimit = Math.PI / 2.3;
    camera.upperRadiusLimit = 50;
    //var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(-Math.PI / 2,  Math.PI / 1.2, 15), scene);
    camera.inputs.clear();

    // The goal distance of camera from target
    camera.radius = 30;

    // The goal height of camera above local origin (centre) of target
    camera.heightOffset = 10;

    // The goal rotation of camera around local origin (centre) of target in x y plane
    camera.rotationOffset = 0;

    // Acceleration of camera in moving from current to goal position
    camera.cameraAcceleration = 0.005;

    // The speed at which acceleration is halted
    camera.maxCameraSpeed = 10;
    camera.checkCollision=true;
    // This attaches the camera to the canvas
    */
    /*
    var camera = new BABYLON.ArcRotateCamera("CameraBaseRotate", -Math.PI/2, Math.PI/2.2, 12, new BABYLON.Vector3(0, 5.0, 0), scene);	
	camera.wheelPrecision = 15;	
	camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius= 22;
	camera.minZ = 0;
	camera.minX = 4096;
	scene.activeCamera = camera;

    //camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

    camera.checkCollision=true;
    camera.attachControl(canvas, true);
    */

    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2,  Math.PI / 1.2, 15, BABYLON.Vector3.Zero(), scene);
    //camera.upperBetaLimit = Math.PI / 2.3;
    camera.ellipsoid = new BABYLON.Vector3(5,5,5);
    camera.checkCollisions = true;
    camera.lowerRadiusLimit = 8;
    camera.upperRadiusLimit = 110;
    camera.layerMask = 1;
    camera.attachControl(canvas, true);

    // setup the camera that will "record" the caustics pattern
    let textureCamera = new BABYLON.ArcRotateCamera("textureCam", 0, 0, 190, new BABYLON.Vector3.Zero(), scene);
    textureCamera.layerMask = 2;
    textureCamera.mode = 1;
    textureCamera.orthoLeft = -10;
    textureCamera.orthoTop = 10;
    textureCamera.orthoRight = 10;
    textureCamera.orthoBottom = -10;

    var lightE = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(1, 1, 0), scene);
	lightE.diffuse = new BABYLON.Color3(1, 1, 1);
    lightE.intensity=0.25;

    // create a spotlight that will project the cuastics pattern as light
    let light1 = new BABYLON.SpotLight("spotLight1", new BABYLON.Vector3(0, 45, 70), BABYLON.Vector3.Down(), BABYLON.Tools.ToRadians(170), 10, scene);
    light1.intensity = 1;

    let light2 = new BABYLON.SpotLight("spotLight2", new BABYLON.Vector3(-30, 45, 40), BABYLON.Vector3.Down(), BABYLON.Tools.ToRadians(170), 10, scene);
    light2.intensity = 1;

    let light3 = new BABYLON.SpotLight("spotLight3", new BABYLON.Vector3(30, 45, 40), BABYLON.Vector3.Down(), BABYLON.Tools.ToRadians(170), 10, scene);
    light3.intensity = 1;

    // create a high resolution plane to function as the basis for the water caustics
    let waterPlane = new BABYLON.Mesh.CreateGround("waterPlane", 35, 35, 800, scene);
    waterPlane.layerMask = 2;

    // setup a render target texture from the view of the texture camera, recording the waterplane...also set the render target UVs to a higher resolution with a mirrored wrap mode
    let renderTarget = new BABYLON.RenderTargetTexture("RTT", 1024, scene);
    renderTarget.activeCamera = textureCamera;
    scene.customRenderTargets.push(renderTarget);
    renderTarget.renderList.push(waterPlane);
    renderTarget.wrapU = BABYLON.Constants.TEXTURE_MIRROR_ADDRESSMODE;
    renderTarget.wrapV = BABYLON.Constants.TEXTURE_MIRROR_ADDRESSMODE;
    renderTarget.uScale = 2;
    renderTarget.vScale = 2;

    // instruct the spotlight to project the rendered target texture as a light projection
    light1.projectionTexture = renderTarget;
    light2.projectionTexture = renderTarget;
    light3.projectionTexture = renderTarget;

    // load the waterShader from a URL snippet and assign it to the high res water plane
    BABYLON.NodeMaterial.ParseFromSnippetAsync("7X2PUH", scene).then(nodeMaterial => {
        nodeMaterial.name = "causticMaterial";
        waterPlane.material = nodeMaterial;
    });

    // particle system variables
    //CODICE NUOVO 
    var volumetricEmitter1 = new BABYLON.AbstractMesh("volumetricEmitter1", scene);
    volumetricEmitter1.position.y = 8;
    volumetricEmitter1.position.z = 70;

    var volumetricEmitter2 = new BABYLON.AbstractMesh("volumetricEmitter2", scene);
    volumetricEmitter2.position.y = 8;
    volumetricEmitter2.position.x = -25;
    volumetricEmitter2.position.z = 40;

    var volumetricEmitter3 = new BABYLON.AbstractMesh("volumetricEmitter3", scene);
    volumetricEmitter3.position.y = 8;
    volumetricEmitter3.position.x = 25;
    volumetricEmitter3.position.z = 40;

    var numberCells;
    //FINE CODICE NUOVO

    // set up animation sheet
    let setupAnimationSheet = function (system, texture, width, height, numSpritesWidth, numSpritesHeight, animationSpeed, isRandom) {
        // assign animation parameters
        system.isAnimationSheetEnabled = true;
        system.particleTexture = new BABYLON.Texture(texture, scene, false, false, BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
        system.particleTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
        system.particleTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
        system.spriteCellWidth = width / numSpritesWidth;
        system.spriteCellHeight = height / numSpritesHeight;
        numberCells = numSpritesWidth * numSpritesHeight;
        system.startSpriteCellID = 0;
        system.endSpriteCellID = numberCells - 1;
        system.spriteCellChangeSpeed = animationSpeed;
        system.spriteRandomStartCell = isRandom;
        system.updateSpeed = 1 / 30;
    };

    // particle system
    let volumetricSystem1 = new BABYLON.ParticleSystem("volumetricSystem1", 150, scene, null, true);
    setupAnimationSheet(volumetricSystem1, "https://models.babylonjs.com/Demos/UnderWaterScene/godRays/volumetricLight.png", 2024, 2024, 4, 1, 0, true);
    volumetricSystem1.emitter = volumetricEmitter1.position;
    let boxEmitter1 = volumetricSystem1.createBoxEmitter(new BABYLON.Vector3(-1, 0, 0), new BABYLON.Vector3(1, 0, 0), new BABYLON.Vector3(-5, 5, -3), new BABYLON.Vector3(5, 5, 3));
    boxEmitter1.radiusRange = 0;
    volumetricSystem1.minInitialRotation = 0;
    volumetricSystem1.maxInitialRotation = 0;
    volumetricSystem1.minScaleX = 6;
    volumetricSystem1.maxScaleX = 10;
    volumetricSystem1.minScaleY = 50;
    volumetricSystem1.maxScaleY = 80;
    volumetricSystem1.minLifeTime = 6;
    volumetricSystem1.maxLifeTime = 9;
    volumetricSystem1.emitRate = 15;
    volumetricSystem1.minEmitPower = 0.05;
    volumetricSystem1.maxEmitPower = 0.1;
    volumetricSystem1.minSize = 0.5;
    volumetricSystem1.maxSize = 5.2;
    volumetricSystem1.addColorGradient(0, new BABYLON.Color4(0, 0, 0, 0));
    volumetricSystem1.addColorGradient(0.5, new BABYLON.Color4(0.25, 0.25, 0.3, 0.2));
    volumetricSystem1.addColorGradient(1.0, new BABYLON.Color4(0, 0, 0, 0));
    volumetricSystem1.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    volumetricSystem1.start();

    // particle system
    let volumetricSystem2 = new BABYLON.ParticleSystem("volumetricSystem2", 150, scene, null, true);
    setupAnimationSheet(volumetricSystem2, "https://models.babylonjs.com/Demos/UnderWaterScene/godRays/volumetricLight.png", 2024, 2024, 4, 1, 0, true);
    volumetricSystem2.emitter = volumetricEmitter2.position;
    let boxEmitter2 = volumetricSystem2.createBoxEmitter(new BABYLON.Vector3(-1, 0, 0), new BABYLON.Vector3(1, 0, 0), new BABYLON.Vector3(-5, 5, -3), new BABYLON.Vector3(5, 5, 3));
    boxEmitter2.radiusRange = 0;
    volumetricSystem2.minInitialRotation = - 0.2; //CODICE NUOVO
    volumetricSystem2.maxInitialRotation = 0;
    volumetricSystem2.minScaleX = 6;
    volumetricSystem2.maxScaleX = 10;
    volumetricSystem2.minScaleY = 50;
    volumetricSystem2.maxScaleY = 80;
    volumetricSystem2.minLifeTime = 6;
    volumetricSystem2.maxLifeTime = 9;
    volumetricSystem2.emitRate = 15;
    volumetricSystem2.minEmitPower = 0.05;
    volumetricSystem2.maxEmitPower = 0.1;
    volumetricSystem2.minSize = 0.5;
    volumetricSystem2.maxSize = 5.2;
    volumetricSystem2.addColorGradient(0, new BABYLON.Color4(0, 0, 0, 0));
    volumetricSystem2.addColorGradient(0.5, new BABYLON.Color4(0.25, 0.25, 0.3, 0.2));
    volumetricSystem2.addColorGradient(1.0, new BABYLON.Color4(0, 0, 0, 0));
    volumetricSystem2.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    volumetricSystem2.start();

    // particle system
    let volumetricSystem3 = new BABYLON.ParticleSystem("volumetricSystem3", 150, scene, null, true);
    setupAnimationSheet(volumetricSystem3, "https://models.babylonjs.com/Demos/UnderWaterScene/godRays/volumetricLight.png", 2024, 2024, 4, 1, 0, true);
    volumetricSystem3.emitter = volumetricEmitter3.position;
    let boxEmitter3 = volumetricSystem3.createBoxEmitter(new BABYLON.Vector3(-1, 0, 0), new BABYLON.Vector3(1, 0, 0), new BABYLON.Vector3(-5, 5, -3), new BABYLON.Vector3(5, 5, 3));
    boxEmitter3.radiusRange = 0;
    volumetricSystem3.minInitialRotation = 0.2; //CODICE NUOVO 
    volumetricSystem3.maxInitialRotation = 0;
    volumetricSystem3.minScaleX = 6;
    volumetricSystem3.maxScaleX = 10;
    volumetricSystem3.minScaleY = 50;
    volumetricSystem3.maxScaleY = 80;
    volumetricSystem3.minLifeTime = 6;
    volumetricSystem3.maxLifeTime = 9;
    volumetricSystem3.emitRate = 15;
    volumetricSystem3.minEmitPower = 0.05;
    volumetricSystem3.maxEmitPower = 0.1;
    volumetricSystem3.minSize = 0.5;
    volumetricSystem3.maxSize = 5.2;
    volumetricSystem3.addColorGradient(0, new BABYLON.Color4(0, 0, 0, 0));
    volumetricSystem3.addColorGradient(0.5, new BABYLON.Color4(0.25, 0.25, 0.3, 0.2));
    volumetricSystem3.addColorGradient(1.0, new BABYLON.Color4(0, 0, 0, 0));
    volumetricSystem3.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    volumetricSystem3.start();

    //Water effect
    let blurAmount = 20;
    let standardPipeline = new BABYLON.PostProcessRenderPipeline(engine, "standardPipeline");
    let horizontalBlur = new BABYLON.BlurPostProcess("horizontalBlur", new BABYLON.Vector2(1.0, 0), blurAmount, 1.0, null, null, engine, false);
    let verticalBlur = new BABYLON.BlurPostProcess("verticalBlur", new BABYLON.Vector2(0, 1), blurAmount, 1.0, null, null, engine, false);
    let blackAndWhiteThenBlur = new BABYLON.PostProcessRenderEffect(engine, "blackAndWhiteThenBlur", function () { 
        return [horizontalBlur, verticalBlur] 
    });
    standardPipeline.addEffect(blackAndWhiteThenBlur);
    scene.postProcessRenderPipelineManager.addPipeline(standardPipeline);
    scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("standardPipeline", textureCamera);

    // SKYBOX
	var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:250.0}, scene);
    skybox.position.y = 35;
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/sea", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;			

    //ADD WALLS TO INDOVIDUATE THE SCENE
    var walls = [];
	const wall_1 = BABYLON.Mesh.CreateBox("wall_1", 10, scene);
   // wall_1.position = new BABYLON.Vector3(94, 80, 66);
	//wall_1.scaling = new BABYLON.Vector3(27, 80, 23);
	wall_1.rotation = new BABYLON.Vector3(0, Math.PI/2.1, 0);
    light1.excludedMeshes.push(wall_1);
	light2.excludedMeshes.push(wall_1);
    light3.excludedMeshes.push(wall_1);
    lightE.excludedMeshes.push(wall_1);
    wall_1.showBoundingBox = true;
    wall_1.physicsImpostor = new BABYLON.PhysicsImpostor(wall_1, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0.8});
    wall_1.physicsImpostor.physicsBody.inertia.setZero();
    wall_1.physicsImpostor.physicsBody.invInertia.setZero();
    wall_1.physicsImpostor.physicsBody.invInertiaWorld.setZero();
    wall_1.freezeWorldMatrix();
    wall_1.convertToUnIndexedMesh();
    wall_1.checkCollisions = true;
    //wall.visibility = 0;

    //PLANE FOR COLLISIONS
    const plane1 = BABYLON.MeshBuilder.CreatePlane("plane1",{size:250.0, sideOrientation: BABYLON.Mesh.DOUBLESIDE},scene);
    plane1.position = new BABYLON.Vector3(150,0,0);
    plane1.physicsImpostor = new BABYLON.PhysicsImpostor(plane1, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10000, restitution: 0});
    plane1.physicsImpostor.physicsBody.inertia.setZero();
    plane1.physicsImpostor.physicsBody.invInertia.setZero();
    plane1.physicsImpostor.physicsBody.invInertiaWorld.setZero();
    plane1.showBoundingBox = true;
    plane1.checkCollisions = true;

    
    // load the assets for the scene and apply node materials from URL snippets
    BABYLON.SceneLoader.ImportMesh("", "https://models.babylonjs.com/Demos/UnderWaterScene/ground/", "underwaterGround.glb", scene, function (newMeshes) {
        newMeshes[0].name = "underWaterGround";
        newMeshes[0].scaling.x = 5;
        newMeshes[0].scaling.z = 5;

        let childMeshes = newMeshes[0].getChildMeshes(false);
        for (let i = 0; i < childMeshes.length; i++) {
            childMeshes[i].layerMask = 1;
        }
        BABYLON.NodeMaterial.ParseFromSnippetAsync("XWTJA2", scene).then(nodeMaterial => {
            nodeMaterial.name = "groundMaterial";
            scene.getMeshByName("ground").material = nodeMaterial;
        });
    });
   
    BABYLON.SceneLoader.ImportMesh("", "https://models.babylonjs.com/Demos/UnderWaterScene/shadows/", "underwaterSceneShadowCatcher.glb", scene, function (newMeshes) {
        newMeshes[0].name = "underWaterShadowCatcher";
        //INIZIO CODICE NUOVO
        newMeshes[0].scaling.x = 3;
        newMeshes[0].scaling.y = 3;
        newMeshes[0].scaling.z = 3;
        newMeshes[0].position.z = 50; 
        //FINE CODICE NUOVO
        let childMeshes = newMeshes[0].getChildMeshes(false);
        for (let i = 0; i < childMeshes.length; i++) {
            childMeshes[i].layerMask = 1;
            childMeshes[i].position.y += 0.01;
        }
        BABYLON.NodeMaterial.ParseFromSnippetAsync("GUKDFQ", scene).then(nodeMaterial => {
            nodeMaterial.name = "shadowCatcherMaterial";
            scene.getMeshByName("shadowCatcher").material = nodeMaterial;
            nodeMaterial.alphaMode = BABYLON.Engine.ALPHA_MULTIPLY;
        });
    });
    BABYLON.SceneLoader.ImportMesh("", "https://models.babylonjs.com/Demos/UnderWaterScene/", "underwaterSceneRocksBarnaclesMussels.glb", scene, function (newMeshes) {
        newMeshes[0].name = "rocksBarnaclesMussels";
        //INIZIO CODICE NUOVO
        newMeshes[0].scaling.x = 3;
        newMeshes[0].scaling.y = 3;
        newMeshes[0].scaling.z = 3;
        newMeshes[0].position.z = 50; 
        //FINE CODICE NUOVO
        let childMeshes = newMeshes[0].getChildMeshes(false);
        for (let i = 0; i < childMeshes.length; i++) {
            childMeshes[i].layerMask = 1;
        }
        BABYLON.NodeMaterial.ParseFromSnippetAsync("UPIJ0M", scene).then(nodeMaterial => {
            nodeMaterial.name = "rocksBMMaterial";
            scene.getMeshByName("rocksBarnaclesMussels_primitive0").material = nodeMaterial;
            scene.getMeshByName("rocksBarnaclesMussels_primitive1").material = nodeMaterial;
            scene.getMeshByName("rocksBarnaclesMussels_primitive2").material = nodeMaterial;
            scene.getMeshByName("rocksBarnaclesMussels_primitive3").material = nodeMaterial;
            scene.getMeshByName("rocksBarnaclesMussels_primitive4").material = nodeMaterial;
        });
    });

    BABYLON.SceneLoader.ImportMesh("", "https://models.babylonjs.com/Demos/UnderWaterScene/", "underwaterScene.glb", scene, function (newMeshes) {
        newMeshes[0].name = "underWaterScene";
        //INIZIO CODICE NUOVO
        newMeshes[0].scaling.x = 3;
        newMeshes[0].scaling.y = 3;
        newMeshes[0].scaling.z = 3;
        newMeshes[0].position.z = 50; 
        //FINE CODICE NUOVO
        let childMeshes = newMeshes[0].getChildMeshes(false);
        for (let i = 0; i < childMeshes.length; i++) {
            childMeshes[i].layerMask = 1;
        }
        BABYLON.NodeMaterial.ParseFromSnippetAsync("EMIYYW", scene).then(nodeMaterial => {
            nodeMaterial.name = "rock1Material";
            scene.getMeshByName("moreRocks").material = nodeMaterial;
        });
        BABYLON.NodeMaterial.ParseFromSnippetAsync("KQX9WD", scene).then(nodeMaterial => {
            nodeMaterial.name = "boardsMaterial";
            scene.getMeshByName("boards").material = nodeMaterial;
        });
        BABYLON.NodeMaterial.ParseFromSnippetAsync("6RIWPP", scene).then(nodeMaterial => {
            nodeMaterial.name = "grassMaterial";
            scene.getMeshByName("grass").material = nodeMaterial;
        });
        BABYLON.NodeMaterial.ParseFromSnippetAsync("S40WL3", scene).then(nodeMaterial => {
            nodeMaterial.name = "shipWheelMat";
            scene.getMeshByName("shipWheel").material = nodeMaterial;
        });
    });

    //MORE ROCKS
    var Myrock = BABYLON.MeshBuilder.CreateSphere("Myrock", 
    {
        segments: 60,
        diameterX: 5,
        diameterY: 9,
        diameterZ: 4,
        updatable:true 
    }, scene);
    Myrock.forceSharedVertices();
    Myrock.position.x = -80;
    Myrock.position.z = 70;
    Myrock.position.y = 0;
    Myrock.setDirection(new BABYLON.Vector3(0, 1, 0));
    var positions = Myrock.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var numberOfVertices = positions.length/3;	
    for(var i = 0; i<numberOfVertices; i++) {  
        positions[i*3] += 0.8 * 0.01;
        positions[i*3+1] += 0.5 * 0.01;
        positions[i*3+2] += 0.02 * 0.01;
    }

    Myrock.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
    const displacementmapURL = "textures/distortion.png";
    Myrock.applyDisplacementMap(displacementmapURL, 0.1, 1);
    Myrock.showBoundingBox = true;

    const Myrock2 = Myrock.clone("Myrock2");
    Myrock2.position.x = -85;
    Myrock2.position.z = 75;
    Myrock2.showBoundingBox = true;
    const Myrock3 = Myrock.clone("Myrock3");
    Myrock3.position.x = -85;
    Myrock3.position.z = 90;
    Myrock3.setDirection(1,0,0);
    Myrock3.showBoundingBox = true;

    
    BABYLON.NodeMaterial.ParseFromSnippetAsync("EMIYYW", scene).then(nodeMaterial => {
        nodeMaterial.name = "rock1Material";
        scene.getMeshByName("Myrock").material = nodeMaterial;
        scene.getMeshByName("Myrock2").material = nodeMaterial;
    });

    //Blocco di sabbia
    var sand_block = BABYLON.MeshBuilder.CreateSphere("sand_block", 
    {
        segments: 30,
        diameterX: 6,
        diameterY: 7,
        diameterZ: 3,
        updatable:true 
    }, scene);
    sand_block.forceSharedVertices();
    sand_block.scaling.x = 2;
    sand_block.scaling.y = 5;
    sand_block.position.y = -1;
    sand_block.position.z = 90;
    sand_block.position.x = -30;
    sand_block.setDirection(new BABYLON.Vector3(0, 1, 0));

    var positions2 = sand_block.getVerticesData(BABYLON.VertexBuffer.PositionKind);

    var numberOfVertices2 = positions2.length/3;	
    for(var i = 0; i<numberOfVertices2; i++) {
    positions2[i*3] += 0.8 * 0.01;
    positions2[i*3+1] += 0.6 * 0.01;
    positions2[i*3+2] += 0.2 * 0.01;
    }

    sand_block.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions2);

    const displacementmapURL2 = "textures/waterbump.png";
    sand_block.applyDisplacementMap(displacementmapURL2, 0.1, 1);
    BABYLON.NodeMaterial.ParseFromSnippetAsync("XWTJA2", scene).then(nodeMaterial => {
        nodeMaterial.name = "groundMaterial";
        scene.getMeshByName("sand_block").material = nodeMaterial;
    });
    sand_block.showBoundingBox = true;
    
    //IMPORT FISH
    BABYLON.SceneLoader.ImportMesh("", "models/", "fish.glb", scene, function(meshes) {
        meshes[0].position.x = -10;
        meshes[0].position.y = 10;
        meshes[0].position.z = -10;
    });

    //IMPORT FISH
    BABYLON.SceneLoader.ImportMesh("", "models/", "fish.glb", scene, function(meshes) {
        meshes[0].position.x = 10;
        meshes[0].position.y = 4;
        meshes[0].position.z = 10;
    });

    var bodyBox = BABYLON.MeshBuilder.CreateBox("bodyBox",{ height: 4.5, width: 6, depth: 8 }, scene);
	bodyBox.position.y = 35;
	var bodyBoxMaterial = new BABYLON.StandardMaterial("bodyBoxMaterial", scene);
	bodyBoxMaterial.alpha = 0;
	bodyBox.material = bodyBoxMaterial;

    //Import Shark
    BABYLON.SceneLoader.ImportMesh("", "models/", "shark.glb", scene, function(meshes) {
        shark = meshes[0];
        shark.checkCollisions = true;
        shark.parent = bodyBox;
        bodyBox.physicsImpostor = new BABYLON.PhysicsImpostor(bodyBox, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1, restitution: 0.9});
        // Add Imposters
   
		bodyBox.physicsImpostor.physicsBody.inertia.setZero();
		bodyBox.physicsImpostor.physicsBody.invInertia.setZero();
		bodyBox.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        bodyBox.showBoundingBox = true;
        camera.target = bodyBox;

        document.addEventListener("keydown", function(ev){
            if(ev.which == 87){//press spacebar to move the player
                speed = .8;
                bodyBox.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 5000, 0), body.getAbsolutePosition());
               
            }
            if(ev.which == 83){//press spacebar to move the player
                speed = -.8;
            }
        });
    
        document.addEventListener("keyup", function(ev){
            if(ev.which == 87){
                speed = 0;
            }
            if(ev.which == 83){
                speed = 0;
            }
        });

        var speed = 0;

        scene.registerBeforeRender(function(){
            var dir = camera.getTarget().subtract(camera.position);
			dir.y = dir.y;
            dir.z = dir.z;
			dir.x = dir.x;
            bodyBox.setDirection(dir);	
            bodyBox.locallyTranslate(new BABYLON.Vector3(0, 0, speed));
        });


    });

   


    return scene;
}

engine.runRenderLoop(function (){
    fps.innerHTML = engine.getFps().toFixed() + " fps";
    if (changescene == 0){
        Menu.render();
    } else if (changescene == 1){
        //console.log(Sea.getWaitingItemsCount());
        if (Sea.getWaitingItemsCount() === 0) {
            window.document.getElementById("loadingBar").style.visibility = "hidden";
            engine.hideLoadingUI();

            Menu.dispose();
            Sea.render();

        } else {
            window.document.getElementById("loadingBar").style.visibility = "visible";
    	    engine.displayLoadingUI();
	    }
    } else if (changescene == 2){
        if (Forest.getWaitingItemsCount() === 0) {
            window.document.getElementById("loadingBar").style.visibility = "hidden";
            engine.hideLoadingUI();

            Menu.dispose();
            Forest.render();

        } else {
            window.document.getElementById("loadingBar").style.visibility = "visible";
    	    engine.displayLoadingUI();
	    }
    } else if (changescene == 3){
        if (Lose.getWaitingItemsCount() === 0) {
            window.document.getElementById("loadingBar").style.visibility = "hidden";
            engine.hideLoadingUI();

            Forest.dispose();
            Lose.render();

        } else {
            window.document.getElementById("loadingBar").style.visibility = "visible";
    	    engine.displayLoadingUI();
	    }
    }
});