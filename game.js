var canvas = document.getElementById("canvas");
var engine = new BABYLON.Engine(canvas,true);
var fps = document.getElementById("fps");

var changescene = 0;

var shark;

//SET LOADING SCENE
function customLoadingScreen() {
}
customLoadingScreen.prototype.displayLoadingUI = function () {
    window.document.getElementById("loadingBar").style.display = "inline";
};
customLoadingScreen.prototype.hideLoadingUI = function () {
    window.document.getElementById("loadingBar").style.display = "none";
};
var loadingScreen = new customLoadingScreen();
engine.loadingScreen = loadingScreen;

window.addEventListener("resize", function () {
    engine.resize();
});

//MAIN MENU
var MainMenu = function () {
    engine.displayLoadingUI();
    var main_menu = new BABYLON.Scene(engine);
    main_menu.clearColor = new BABYLON.Vector3(0,0,0);

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

        //create a title -> Game's Name
        const Title = new BABYLON.GUI.TextBlock();
        Title.text = "A n i m a l    L i f e";
        Title.fontFamily = "My Font";
        Title.fontSize = "90px";
        Title.color = "white";
        Title.resizeToFit = true;
        Title.paddingTop = "40px";
        Title.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        guiMenu.addControl(Title);

        var textblock_info = new BABYLON.GUI.TextBlock();
        textblock_info.paddingTop = "90%";
        textblock_info.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        textblock_info.height = "150px";
        textblock_info.resizeToFit = true;
        textblock_info.fontSize = 40;
        textblock_info.fontFamily = "My Font";
        textblock_info.text = "Select difficulty and check the earth planet to start!";
        textblock_info.color = "white";
        guiMenu.addControl(textblock_info);

        var textblock_goal = new BABYLON.GUI.TextBlock();
        textblock_goal.paddingLeft = "1200px";
        textblock_goal.paddingRight = "2px";
        textblock_goal.paddingTop = "200px";
        //textblock_goal.paddingBottom = "-5px";
        textblock_goal.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        textblock_goal.height = "150px";
        textblock_goal.resizeToFit = true;
        textblock_goal.fontSize = 40;
        textblock_goal.fontFamily = "My Font";
        textblock_goal.text = "The goal of the game is to find\n all the eggs before the \n time runs out";
        textblock_goal.color = "white";
        guiMenu.addControl(textblock_goal);

        var panel_difficulty = new BABYLON.GUI.StackPanel();
        panel_difficulty.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        panel_difficulty.paddingTop = "25.5%";
        panel_difficulty.paddingBottom = "-25.5%";
        panel_difficulty.paddingRight = "38%";
        panel_difficulty.paddingLeft = "-32%";
        guiMenu.addControl(panel_difficulty);

        var textblock = new BABYLON.GUI.TextBlock();
        textblock.height = "150px";
        textblock.fontSize = 50;
        textblock.fontFamily = "My Font";
        textblock.text = "SELECT DIFFICULTY";
        textblock.color = "white";
        panel_difficulty.addControl(textblock); 

        var addRadio = function(text, parent) {

            var button = new BABYLON.GUI.RadioButton();
            button.width = "30px";
            button.height = "30px";
            button.color = "white";
            button.background = "green";

            if(text == "MEDIUM"){
                button.isChecked = true;
            }

            button.onIsCheckedChangedObservable.add(function(state) {
                if (state) {
                    if (text == "EASY"){
                        countdown_game = easy;
                        selected_difficulty = easy;
                        eggs_level = 4;
                        num_eggs = eggs_level;
                        //number_url = number4_url;
                        textblock.text = "You Selected Easy";
                    } 
                    if (text == "MEDIUM"){
                        countdown_game = medium;
                        selected_difficulty = medium;
                        eggs_level = 5;
                        num_eggs = eggs_level;
                        number_url = number5_url;
                        textblock.text = "You Selected Medium";
                    }
                    if (text == "IMPOSSIBLE"){ 
                        countdown_game = impossible;
                        selected_difficulty = impossible;
                        eggs_level = 6;
                        num_eggs = eggs_level;
                        number_url = number6_url;
                        textblock.text = "You Selected Impossible";
                    }
                }
            });
    
            var header = BABYLON.GUI.Control.AddHeader(button, text, "150px", { isHorizontal: true, controlFirst: true });
            header.height = "60px";
            header.children[1].fontSize = 30;
            header.children[1].fontFamily = "My Font";
            header.children[1].color = "white";
            header.children[1].width ="180px";
    
            parent.addControl(header);    
        }
    
        addRadio("EASY", panel_difficulty);
        addRadio("MEDIUM", panel_difficulty);
        addRadio("IMPOSSIBLE", panel_difficulty);


       
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
        sea_button.imageUrl = "textures/Play.png";
        sea_button.isVisible = false;

        var pole_button = new BABYLON.GUI.HolographicButton();
        pole_button.position.x = 5.5;
        panel1.addControl(pole_button);
        pole_button.scaling.x = -0.1;
        pole_button.scaling.y = 0.1;
        pole_button.scaling.z = -0.1;
        pole_button.text = "NORTH POLE";
        pole_button.imageUrl = "textures/Play.png";
        pole_button.isVisible = false;
    
        var forest_button = new BABYLON.GUI.HolographicButton();
        forest_button.position.x = 5.5;
        panel2.addControl(forest_button);
        forest_button.scaling.x = -0.1;
        forest_button.scaling.y = 0.1;
        forest_button.scaling.z = -0.1;
        panel2.blockLayout = true;
        forest_button.imageUrl = "textures/Play.png";
    
        var city_button = new BABYLON.GUI.HolographicButton();
        city_button.position.x = 0.5;
        panel3.addControl(city_button);
        city_button.scaling.x = -0.1;
        city_button.scaling.y = 0.1;
        city_button.scaling.z = -0.1;
        city_button.text = "CITY";
        city_button.imageUrl = "textures/Play.png";
        city_button.isVisible = false;

        var command_image = new BABYLON.GUI.Image("command_image", "GUI_IMAGES/tastiera_mouse.png");
        command_image.width = "29%";
        command_image.height = "50%";
        command_image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        command_image.paddingTop = "100px";
        command_image.paddingRight = "25px";
        guiMenu.addControl(command_image);

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
var Winning;


var jump=0;
var walkStepsCounter = 0;
var walkBackStepsCounter = 0;
var RoarCounter = 0;

var change = false;
var change_back = false;
var change_roar = false;

var up_down_egg = 0;
var change_egg = false;


//Difficulty countodowns
var easy = 90;
var medium = 60;
var impossible = 45;
var selected_difficulty = medium;

//By default
var countdown_game = medium;

//ID of set Interval
var counterId;

// Check if the first time call the function FOREST_Scene
var call_forest = 0;

//When is 1 start the roar anim
var roar_anim = 0;

//Variables for check eggs
var intersct_egg = 0;
var intersct_egg2 = 0;
var intersct_egg3 = 0;
var intersct_egg4 = 0;
var intersct_egg5 = 0;
var intersct_egg6 = 0;

//URL for current number
var number6_url = "textures/6.png";
var number5_url = "textures/5.png";
var number_url = number5_url;

//Egg count
var eggs_level;
var num_eggs = 5;

var URL_Eggs = function(){
    if(num_eggs == 6){
        number_url = number5_url;
    }
}

var FOREST_Scene = function(){
    var scene = new BABYLON.Scene(engine);
    engine.displayLoadingUI();

     // Load the sound and play it automatically once ready
     var music = new BABYLON.Sound("Forest", "sounds/forest_snd.wav", scene, null, {
        loop: true,
        autoplay: true,
        volume: 0.2
    });

    var roar = new BABYLON.Sound("Forest", "sounds/roar.wav", scene, null, {volume: 0.1});

    //Enable physic for the main scene
    var gravityVector = new BABYLON.Vector3(0,-150, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);

    scene.collisionsEnabled = true;
    scene.clearColor = new BABYLON.Color3(0.5, 0.8, 0.5);
    scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

    //Optimization
	var optimizer = new BABYLON.SceneOptimizerOptions(60, 2000);
    optimizer.addOptimization(new BABYLON.ShadowsOptimization(0));
    optimizer.addOptimization(new BABYLON.LensFlaresOptimization(0));
    optimizer.addOptimization(new BABYLON.PostProcessesOptimization(1));
    optimizer.addOptimization(new BABYLON.ParticlesOptimization(1));
    optimizer.addOptimization(new BABYLON.TextureOptimization(2, 512));
    optimizer.addOptimization(new BABYLON.RenderTargetsOptimization(0));

    var sceneOptimizer = new BABYLON.SceneOptimizer(scene, optimizer, true, true);


    //GUI
    const guiGame = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GameGui",true,scene);

    var rect1 = new BABYLON.GUI.Rectangle();
    rect1.width = "120px";
    rect1.height = "70px";
    rect1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    rect1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    rect1.paddingLeft = "-32px";
    rect1.paddingRight = "2px";
    rect1.paddingTop = "5px";
    rect1.paddingBottom = "-5px";
    rect1.background = "grey";

    var Countdown = new BABYLON.GUI.TextBlock("Countdown",countdown_game); 
    Countdown.color = "white";
    Countdown.fontFamily = "My Font";
    Countdown.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    Countdown.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    Countdown.paddingLeft = "-32px";
    Countdown.paddingRight = "32px";
    Countdown.paddingTop = "5px";
    Countdown.paddingBottom = "-5px";
    Countdown.fontSize = 50;

    guiGame.addControl(rect1);
    rect1.addControl(Countdown);

    var label = new BABYLON.GUI.TextBlock();
    label.fontFamily = "Courier";
    label.text = "Hit the trunk\n to move it";
    label.color = "white";
    guiGame.addControl(label);

    Countdown.onTextChangedObservable.add(function () {
        if(countdown_game == 0){
            music.stop();
            clearInterval(counterId);
            Lose = LOSING_Scene();
            changescene = 3;
        }   
    });


    //REMAINING LIFES
    var remain_image = new BABYLON.GUI.Image("remaim_eggs_image", "textures/remain.png");
        remain_image.width = "250px";
        remain_image.height = "100px";
        remain_image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        remain_image.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        remain_image.paddingLeft = "-25px";
        remain_image.paddingRight = "25px";
        remain_image.paddingTop = "90px";
        remain_image.paddingBottom = "-70px";
    
    guiGame.addControl(remain_image);


    //EGG ICON
    var egg_image = new BABYLON.GUI.Image("eggs_image", "textures/egg_img.png");
        egg_image.width = "50px";
        egg_image.height = "200px";
        egg_image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        egg_image.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        egg_image.paddingLeft = "-25px";
        egg_image.paddingRight = "25px";
        egg_image.paddingTop = "200px";
        egg_image.paddingBottom = "-70px";
    
    guiGame.addControl(egg_image);    

    //6 ICON
    var number_image = new BABYLON.GUI.Image("number_image",number_url);
        number_image.width = "150px";
        number_image.height = "200px";
        number_image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        number_image.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        number_image.paddingLeft = "-25px";
        number_image.paddingRight = "70px";
        number_image.paddingTop = "200px";
        number_image.paddingBottom = "-70px";
    
    guiGame.addControl(number_image);    

    // SKYBOX
	var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/forest", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skybox.material = skyboxMaterial;		
    
	//Defininng the scene camera
	var camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 3.5, Math.PI / 2.5, 35, new BABYLON.Vector3(0, 0, 60), scene);
    scene.activeCamera = camera;
    scene.activeCamera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 10;
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
  
    groundMaterial.diffuseTexture = new BABYLON.Texture("textures/prato.jpg", scene);
    //groundMaterial.diffuseTexture.uScale = 8;
    //groundMaterial.diffuseTexture.vScale = 8;
    groundMaterial.specularTexture = new BABYLON.Texture("textures/prato.jpg", scene);
    //groundMaterial.specularTexture.uScale = 8;
    //groundMaterial.specularTexture.vScale = 8;

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
    fountain.scaling = new BABYLON.Vector3(2.5,2,2.5);
    //fountain.showBoundingBox = true;
    fountain.physicsImpostor = new BABYLON.PhysicsImpostor(fountain, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);
    shadowGenerator.addShadowCaster(fountain);

    var mat1 = new BABYLON.StandardMaterial("mat1", scene);
	mat1.diffuseTexture = new BABYLON.Texture("textures/wall1.jpeg", scene);
    mat1.specularTexture = new BABYLON.Texture("textures/wall1.jpeg", scene);
	mat1.bumpTexture = new BABYLON.Texture("textures/wall.jpeg", scene);
    fountain.material = mat1;
    

    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem("particles", 50000, scene);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);

    // Where the particles come from
    particleSystem.emitter = new BABYLON.Vector3(250, 30, 0); // the starting object, the emitter
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
    BABYLON.SceneLoader.ImportMesh("", "models/", "rock.obj", scene, function (newMeshes) {
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

        //rockTask.showBoundingBox = true;

        rockTask.physicsImpostor = new BABYLON.PhysicsImpostor(rockTask, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 150, restitution: 0});
        rockTask.physicsImpostor.physicsBody.inertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertia.setZero();
        rockTask.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        shadowGenerator.addShadowCaster(rockTask);

    });

    // ADD ROCK2
    BABYLON.SceneLoader.ImportMesh("", "models/", "Rock_6.OBJ", scene, function (newMeshes) {
        // Only one mesh here
        var rock = newMeshes[0];
        rock.scaling.scaleInPlace(3);
        rock.position.x = -100;
        rock.position.z = -40;
        rock.position.y = 2;

        var rockMaterial2 = new BABYLON.StandardMaterial("rockmaterial2", scene);
        rockMaterial2.diffuseTexture = new BABYLON.Texture("textures/Rock_6_d.jfif", scene);
        rockMaterial2.specularTexture = new BABYLON.Texture("textures/Rock_6_d.jfif", scene);
        rock.material = rockMaterial2;
        rock.scaling.scaleInPlace(10);

        rock.physicsImpostor = new BABYLON.PhysicsImpostor(rock, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0});
        rock.physicsImpostor.physicsBody.inertia.setZero();
        rock.physicsImpostor.physicsBody.invInertia.setZero();
        rock.physicsImpostor.physicsBody.invInertiaWorld.setZero();


        //rock.showBoundingBox = true;

        shadowGenerator.addShadowCaster(rock);
    });

    //BUSH
    BABYLON.SceneLoader.ImportMesh("", "models/obj-files/", "bush1.obj", scene, function (newMeshes) {
        //console.log(newMeshes);
        newMeshes[0].scaling.scaleInPlace(2);
        newMeshes[1].scaling.scaleInPlace(2);
        var bush = newMeshes[0];
        var leaves = newMeshes[1];

        bush.position.z = -180;
        leaves.position.z = -180; 

        //bush.showBoundingBox = true;
        //leaves.showBoundingBox = true;

        var leafMaterial = new BABYLON.StandardMaterial("leaf", scene);
        leafMaterial.diffuseColor = new BABYLON.Vector3(0,0.3,0.1);
        //leafMaterial.diffuseTexture = new BABYLON.Texture("models/obj-files/Bush_leaf_1K_Base_Color.png", scene);
        //leafMaterial.specularTexture = new BABYLON.Texture("models/obj-files/Bush_leaf_1K_Base_Color.png", scene);
        //leafMaterial.bumpTexture = new BABYLON.Texture("models/obj-files/Bush_leaf_1K_Normal.png", scene);
        newMeshes[1].material = leafMaterial;

        var woodMaterial = new BABYLON.StandardMaterial("wood", scene);
        woodMaterial.diffuseTexture = new BABYLON.Texture("models/obj-files/wood.jpeg", scene);
        woodMaterial.specularTexture = new BABYLON.Texture("models/obj-files/wood.jpeg", scene);
        //woodMaterial.bumpTexture = new BABYLON.Texture("models/obj-files/textures/Bark_04_3K_Normal.png", scene);
        newMeshes[0].material =  woodMaterial; 

        var bush1 = bush.createInstance("");
        bush1.scaling.scaleInPlace(5);
        bush1.position.x = 40;
        bush1.position.z = -250;
        shadowGenerator.addShadowCaster(bush1);
        var leaves1 = leaves.createInstance("");
        leaves1.scaling.scaleInPlace(5);
        leaves1.position.x = 40;
        leaves1.position.z = -250;
        shadowGenerator.addShadowCaster(leaves1);

        var bush2 = bush.createInstance("");
        bush2.scaling.scaleInPlace(3);
        bush2.position.x = 190;
        bush2.position.z = -80;
        shadowGenerator.addShadowCaster(bush2);
        var leaves2 = leaves.createInstance("");
        leaves2.scaling.scaleInPlace(3);
        leaves2.position.x = 190;
        leaves2.position.z = -80;
        shadowGenerator.addShadowCaster(leaves2);

        var bush3 = bush.createInstance("");
        bush3.scaling.scaleInPlace(5);
        bush3.position.x = 0;
        bush3.position.z = -280;
        shadowGenerator.addShadowCaster(bush3);
        var leaves3 = leaves.createInstance("");
        leaves3.scaling.scaleInPlace(5);
        leaves3.position.x = 0;
        leaves3.position.z = -280;
        shadowGenerator.addShadowCaster(leaves3);

        var bush4 = bush.createInstance("");
        bush4.scaling.scaleInPlace(5);
        bush4.position.x = -70;
        bush4.position.z = -160;
        shadowGenerator.addShadowCaster(bush4);
        var leaves4 = leaves.createInstance("");
        leaves4.scaling.scaleInPlace(5);
        leaves4.position.x = -70;
        leaves4.position.z = -160;
        shadowGenerator.addShadowCaster(leaves4);

        var bush5 = bush.createInstance("");
        bush5.scaling.scaleInPlace(5);
        bush5.position.x = 60;
        bush5.position.z = -215;
        shadowGenerator.addShadowCaster(bush5);
        var leaves5 = leaves.createInstance("");
        leaves5.scaling.scaleInPlace(5);
        leaves5.position.x = 60;
        leaves5.position.z = -215;
        shadowGenerator.addShadowCaster(leaves5);

        var bush6 = bush.createInstance("");
        bush6.scaling.scaleInPlace(5);
        bush6.position.x = -60;
        bush6.position.z = -215;
        shadowGenerator.addShadowCaster(bush6);
        var leaves6 = leaves.createInstance("");
        leaves6.scaling.scaleInPlace(5);
        leaves6.position.x = -60;
        leaves6.position.z = -215;
        shadowGenerator.addShadowCaster(leaves6);

        var bush7 = bush.createInstance("");
        bush7.scaling.scaleInPlace(5);
        bush7.position.x = 20;
        bush7.position.z = -270;
        shadowGenerator.addShadowCaster(bush7);
        var leaves7 = leaves.createInstance("");
        leaves7.scaling.scaleInPlace(5);
        leaves7.position.x = 20;
        leaves7.position.z = -270;
        shadowGenerator.addShadowCaster(leaves7);
       

        bush.isVisible = false;
        leaves.isVisible = false;

    });


    var logMaterial = new BABYLON.StandardMaterial("log", scene);
    logMaterial.diffuseTexture = new BABYLON.Texture("models/Log_Material_Diffuse.png", scene);
    logMaterial.specularTexture = new BABYLON.Texture("models/Log_Material_Glossiness.png", scene);
    logMaterial.bumpTexture = new BABYLON.Texture("models/Log_Material_Normal.png", scene);

    //LOG
    var log1;
    var log0;
    var log_bounding;

    //BOUNDING BOX FOR TRUNK 1
    var LogBoundingBox = BABYLON.MeshBuilder.CreateBox("LogBoundingBox",{ height: 20.0, width: 20, depth: 100 }, scene);
        LogBoundingBox.rotation = new BABYLON.Vector3(0, Math.PI/6, 0);
        LogBoundingBox.position.y = 10;
        LogBoundingBox.position.x = 65;
        LogBoundingBox.position.z = -80;
	var LogBoundingBoxMaterial = new BABYLON.StandardMaterial("LogBoundingBoxMaterial", scene);
		LogBoundingBoxMaterial.alpha = 0;
		LogBoundingBox.material = LogBoundingBoxMaterial;

    //BOUDNING BOX FOR TRUNK 2
    var LogBoundingBox2 = BABYLON.MeshBuilder.CreateBox("LogBoundingBox2",{ height: 15.0, width: 20, depth: 100 }, scene);
        LogBoundingBox2.rotation = new BABYLON.Vector3(0, Math.PI/6, 0);
        LogBoundingBox2.position.y = 10;
        LogBoundingBox2.position.x = 90;
        LogBoundingBox2.position.z = -90;
    var LogBoundingBoxMaterial2 = new BABYLON.StandardMaterial("LogBoundingBoxMaterial2", scene);
        //LogBoundingBoxMaterial2.diffuseColor = new BABYLON.Color3(1,0,0);
        LogBoundingBoxMaterial2.alpha = 0;
		LogBoundingBox2.material = LogBoundingBoxMaterial2;
    
    //BOUDING BOX FOR TRUNK 3
    var LogBoundingBox3 = BABYLON.MeshBuilder.CreateBox("LogBoundingBox3",{ height: 18.0, width: 20, depth: 100 }, scene);
        LogBoundingBox3.rotation = new BABYLON.Vector3(0, Math.PI/6, 0);
        LogBoundingBox3.position.y = 30;
        LogBoundingBox3.position.x = 90;
        LogBoundingBox3.position.z = -90;
    var LogBoundingBoxMaterial3 = new BABYLON.StandardMaterial("LogBoundingBoxMaterial3", scene);
        //LogBoundingBoxMaterial3.diffuseColor = new BABYLON.Color3(0,1,0);
        LogBoundingBoxMaterial3.alpha = 0;
		LogBoundingBox3.material = LogBoundingBoxMaterial3;

    BABYLON.SceneLoader.ImportMesh("", "models/", "wood_2.obj", scene, function (newMeshes) {
        console.log("wood");
        console.log(newMeshes);
        log1 = newMeshes[1];
        log0 = newMeshes[0];
        //newMeshes[1].showBoundingBox = true;
        log1.rotation = new BABYLON.Vector3(Math.PI/2, 0, -Math.PI/6);
        log0.rotation = new BABYLON.Vector3(Math.PI/2, 0, -Math.PI/6);

        log0.position.y = 5;
        log1.position.y = 5;
        log0.position.x = 40;
        log1.position.x = 40;
        log0.position.z = -120;
        log1.position.z = -120;


        log0.material = logMaterial;
        log1.material = logMaterial;

        log_bounding = newMeshes[1];

        LogBoundingBox.physicsImpostor = new BABYLON.PhysicsImpostor(LogBoundingBox, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0});
        LogBoundingBox.physicsImpostor.physicsBody.inertia.setZero();
        LogBoundingBox.physicsImpostor.physicsBody.invInertia.setZero();
        LogBoundingBox.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        //TRUNK 2
        var trunk2 = log1.createInstance("");
        trunk2.position.y = 5;
        trunk2.position.x = 65;
        trunk2.position.z = -135;
        LogBoundingBox2.physicsImpostor = new BABYLON.PhysicsImpostor(LogBoundingBox2, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0});
        LogBoundingBox2.physicsImpostor.physicsBody.inertia.setZero();
        LogBoundingBox2.physicsImpostor.physicsBody.invInertia.setZero();
        LogBoundingBox2.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        //TRUNK 3
        var trunk3 = log1.createInstance("");
        trunk3.position.y = 28;
        trunk3.position.x = 65;
        trunk3.position.z = -135;
        LogBoundingBox3.physicsImpostor = new BABYLON.PhysicsImpostor(LogBoundingBox3, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0});
        LogBoundingBox3.physicsImpostor.physicsBody.inertia.setZero();
        LogBoundingBox3.physicsImpostor.physicsBody.invInertia.setZero();
        LogBoundingBox3.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        //FOR DEBUGGING
        //LogBoundingBox.showBoundingBox = true;
        //LogBoundingBox2.showBoundingBox = true;
        //LogBoundingBox3.showBoundingBox = true;

        shadowGenerator.addShadowCaster(newMeshes[1]);
        shadowGenerator.addShadowCaster(newMeshes[0]);
    });

    //FLOWERS
    BABYLON.SceneLoader.ImportMesh("", "models/", "flowers.obj", scene, function (newMeshes) {
        console.log("Tulips");
        console.log(newMeshes);
        for (var i = 0; i<12; i ++){
            newMeshes[i].scaling.scaleInPlace(15);
            newMeshes[i].position.x = 360;
            newMeshes[i].position.z = 75;
        }
    });

     //FLOWERS
    BABYLON.SceneLoader.ImportMesh("", "models/", "flowers.obj", scene, function (newMeshes) {
        console.log("Tulips");
        console.log(newMeshes);
        for (var i = 0; i<12; i ++){
            newMeshes[i].scaling.scaleInPlace(10);
            newMeshes[i].position.x = 365;
            newMeshes[i].position.z = 60;
        }
    });

     //FLOWERS
     BABYLON.SceneLoader.ImportMesh("", "models/", "flowers.obj", scene, function (newMeshes) {
        console.log("Tulips");
        console.log(newMeshes);
        for (var i = 0; i<12; i ++){
            newMeshes[i].scaling.scaleInPlace(20);
            newMeshes[i].position.x = 365;
            newMeshes[i].position.z = 70;
        }
    });

    //FENCE
    var FenceMaterial = new BABYLON.StandardMaterial("fence_mat",scene);
    FenceMaterial.bumpTexture = new BABYLON.Texture("models/fence_normals.png",scene);
    FenceMaterial.diffuseTexture = new BABYLON.Texture("models/fence_occlusion.png",scene);
    FenceMaterial.specularTexture = new BABYLON.Texture("models/fence_occlusion.png",scene);
    BABYLON.SceneLoader.ImportMesh("", "models/", "fence_2.obj", scene, function (newMeshes) {
        newMeshes[1].position.x = 370;
        newMeshes[0].position.x = 370;
        newMeshes[1].position.z = 30;
        newMeshes[0].position.z = 30;
        newMeshes[1].scaling.scaleInPlace(11);
        newMeshes[0].scaling.scaleInPlace(11);
        newMeshes[0].material= FenceMaterial;
        newMeshes[1].material= FenceMaterial;
        shadowGenerator.addShadowCaster(newMeshes[1]);
        shadowGenerator.addShadowCaster(newMeshes[0]);
    });

    BABYLON.SceneLoader.ImportMesh("", "models/", "fence_2.obj", scene, function (newMeshes) {
        newMeshes[1].position.x = 370;
        newMeshes[0].position.x = 370;
        newMeshes[1].position.z = -30;
        newMeshes[0].position.z = -30;
        newMeshes[1].scaling.scaleInPlace(11);
        newMeshes[0].scaling.scaleInPlace(11);
        newMeshes[0].material= FenceMaterial;
        newMeshes[1].material= FenceMaterial;
        shadowGenerator.addShadowCaster(newMeshes[1]);
        shadowGenerator.addShadowCaster(newMeshes[0]);

    });

    BABYLON.SceneLoader.ImportMesh("", "models/", "fence_2.obj", scene, function (newMeshes) {

        newMeshes[1].rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
        newMeshes[0].rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
        newMeshes[1].position.x = 310;
        newMeshes[0].position.x = 310;
        newMeshes[1].position.z = -75;
        newMeshes[0].position.z = -75;
        newMeshes[1].scaling.scaleInPlace(11);
        newMeshes[0].scaling.scaleInPlace(11);
        newMeshes[0].material= FenceMaterial;
        newMeshes[1].material= FenceMaterial;
        shadowGenerator.addShadowCaster(newMeshes[1]);
        shadowGenerator.addShadowCaster(newMeshes[0]);

    });
    BABYLON.SceneLoader.ImportMesh("", "models/", "fence_2.obj", scene, function (newMeshes) {
        newMeshes[1].rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
        newMeshes[0].rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
        newMeshes[1].position.x = 250;
        newMeshes[0].position.x = 250;
        newMeshes[1].position.z = -75;
        newMeshes[0].position.z = -75;
        newMeshes[1].scaling.scaleInPlace(11);
        newMeshes[0].scaling.scaleInPlace(11);
        newMeshes[0].material= FenceMaterial;
        newMeshes[1].material= FenceMaterial;
        shadowGenerator.addShadowCaster(newMeshes[1]);
        shadowGenerator.addShadowCaster(newMeshes[0]);

    });
    BABYLON.SceneLoader.ImportMesh("", "models/", "fence_2.obj", scene, function (newMeshes) {

        newMeshes[1].rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
        newMeshes[0].rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
        newMeshes[1].position.x = 310;
        newMeshes[0].position.x = 310;
        newMeshes[1].position.z = 75;
        newMeshes[0].position.z = 75;
        newMeshes[1].scaling.scaleInPlace(11);
        newMeshes[0].scaling.scaleInPlace(11);
        newMeshes[0].material= FenceMaterial;
        newMeshes[1].material= FenceMaterial;
        shadowGenerator.addShadowCaster(newMeshes[1]);
        shadowGenerator.addShadowCaster(newMeshes[0]);

    });
    BABYLON.SceneLoader.ImportMesh("", "models/", "fence_2.obj", scene, function (newMeshes) {
        newMeshes[1].rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
        newMeshes[0].rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
        newMeshes[1].position.x = 250;
        newMeshes[0].position.x = 250;
        newMeshes[1].position.z = 75;
        newMeshes[0].position.z = 75;
        newMeshes[1].scaling.scaleInPlace(11);
        newMeshes[0].scaling.scaleInPlace(11);
        newMeshes[0].material= FenceMaterial;
        newMeshes[1].material= FenceMaterial;
        shadowGenerator.addShadowCaster(newMeshes[1]);
        shadowGenerator.addShadowCaster(newMeshes[0]);

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
        //Wall1.showBoundingBox = true;
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
        //Wall2.showBoundingBox = true;
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
        //Wall3.showBoundingBox = true;
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
        //Wall4.showBoundingBox = true;
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
        //Wall5.showBoundingBox = true;
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
        //Wall6.showBoundingBox = true;
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
        //Wall7.showBoundingBox = true;
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
        //Wall8.showBoundingBox = true;
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
        //Wall9.showBoundingBox = true;
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
        //Wall10.showBoundingBox = true;
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
        //Wall11.showBoundingBox = true;
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
        //Wall12.showBoundingBox = true;
        //Wall12.visibility = 0;
        Wall12.checkCollisions = true;
        Wall12.material = wall_material;
    perimeter_scene.push(Wall12);

    //TREE
    var tree = BABYLON.SceneLoader.ImportMesh("","//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (meshes) {
        var tree = meshes[0];
        tree.scaling = new BABYLON.Vector3(600, 600, 600);
        tree.position = new BABYLON.Vector3(0, 0, 0);
        //tree.showBoundingBox;
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
        
        // var tree4 = tree.createInstance("");
        // tree4.position.x = 190;
        // tree4.position.z = -200;
        // shadowGenerator.addShadowCaster(tree4);

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
        tree14.position.x = 180;
        tree14.position.z = -290;
        shadowGenerator.addShadowCaster(tree14);
        
        var tree15 = tree.createInstance("");
        tree15.position.x = 350;
        tree15.position.z = -100;
        shadowGenerator.addShadowCaster(tree15);

        var tree16 = tree.createInstance("");
        tree16.position.x = 280;
        tree16.position.z = -200;
        shadowGenerator.addShadowCaster(tree16);

        var tree17 = tree.createInstance("");
        tree17.position.x = 100;
        tree17.position.z = -200;
        shadowGenerator.addShadowCaster(tree17);

        var tree18 = tree.createInstance("");
        tree18.position.x = 150;
        tree18.position.z = -150;
        shadowGenerator.addShadowCaster(tree18);

        var tree19 = tree.createInstance("");
        tree19.position.x = 200;
        tree19.position.z = -100;
        shadowGenerator.addShadowCaster(tree19);

        var tree20 = tree.createInstance("");
        tree20.position.x = 100;
        tree20.position.z = -280;
        shadowGenerator.addShadowCaster(tree20); 

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

    // Add the highlight layer.
    var hl = new BABYLON.HighlightLayer("hl1", scene);


    //ADD EGGS  
    var egg;
    var egg2;
    BABYLON.SceneLoader.ImportMesh("", "models/", "egg.obj", scene, function (newMeshes) {
        egg = newMeshes[0];
        egg.position.y = 5;
        egg.position.x = 320;
        egg.scaling.scaleInPlace(2);

        hl.addMesh(egg, BABYLON.Color3.Yellow());
        //egg.showBoundingBox = true;

        console.log("new meshes egg imported:", newMeshes);

        egg2 = egg.createInstance("");
        egg2.position.x = 95;
        egg2.position.z = 90;
        egg2.position.y = 60;

        egg3 = egg.createInstance("");
        egg3.position.x = -150;
        egg3.position.z = -40;

        if(selected_difficulty != easy){
            egg4 = egg.createInstance("");
            egg4.position.x = 150;
            egg4.position.z = -80;
            egg4.position.y = 70;

            shadowGenerator.addShadowCaster(egg4);
        }

        egg5 = egg.createInstance("");
        egg5.position.x = -50;
        egg5.position.z = 190;
        egg5.position.y = 60;

        if(selected_difficulty == impossible){
            egg6 = egg.createInstance("");
            egg6.position.z = 5;
            egg6.position.x = 60;
            egg6.position.z = -280;

            shadowGenerator.addShadowCaster(egg6);
        }

        shadowGenerator.addShadowCaster(egg);
        shadowGenerator.addShadowCaster(egg2);
        shadowGenerator.addShadowCaster(egg3);


        scene.registerBeforeRender(function () {
            if(up_down_egg>50){
                change_egg = true;
            }else if(up_down_egg<0){
                change_egg = false;
            }
            if(!change_egg){
                egg.position.y += 0.1;
                egg3.position.y += 0.1;
                egg5.position.y += 0.1;

                if(selected_difficulty != easy)
                    egg4.position.y += 0.1;
                
                egg2.position.x += 0.2;

                if(selected_difficulty == impossible)
                    egg6.position.y += 0.1;
                up_down_egg++;
            }else{
                egg.position.y -= 0.1;
                egg3.position.y -= 0.1;
                egg5.position.y -= 0.1;
                
                if(selected_difficulty != easy)
                    egg4.position.y -= 0.1;
                
                if(selected_difficulty == impossible)
                    egg6.position.y -= 0.1;
                
                egg2.position.x -= 0.2;
                up_down_egg--;
            }
        });

    });

    var tronco;

    //ADD TRONCO
    BABYLON.SceneLoader.ImportMesh("", "models/", "tronco.obj", scene, function (newMeshes) {
        // Only one mesh here
        tronco = newMeshes[0];
        tronco.position.x = 0;
        tronco.position.z = 140;
        tronco.position.y = 32;

        tronco.scaling.scaleInPlace(8);
        //tronco.showBoundingBox = true;

        tronco.physicsImpostor = new BABYLON.PhysicsImpostor(tronco, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 20, restitution: 0});
		tronco.physicsImpostor.physicsBody.inertia.setZero();
		tronco.physicsImpostor.physicsBody.invInertia.setZero();
		tronco.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        var TroncoMaterial = new BABYLON.StandardMaterial("tronco_mat",scene);
        TroncoMaterial.diffuseTexture = new BABYLON.Texture("models/wood_tex.jpg",scene);
        TroncoMaterial.specularTexture = new BABYLON.Texture("models/wood_tex.jpg",scene);
        tronco.material = TroncoMaterial;

        label.linkWithMesh(tronco);
    });

    var RexBoundingBox = BABYLON.MeshBuilder.CreateBox("RexBoundingBox",{ height: 7.0, width: 10, depth: 25 }, scene);
		RexBoundingBox.position.y = 3.5;
	var RexBoundingBoxMaterial = new BABYLON.StandardMaterial("RexBoundingBoxMaterial", scene);
		RexBoundingBoxMaterial.alpha = 0;
		RexBoundingBox.material = RexBoundingBoxMaterial;

    var rex;
    var rex_skeleton;
    var rex_bounding;

    BABYLON.SceneLoader.ImportMesh("", "models/Trex/", "trex.gltf", scene, function (newMeshes, particleSystems, skeletons) {

        console.log("new meshes imported:", newMeshes);
        rex=newMeshes[0];
        rex.scaling.scaleInPlace(5);
		rex.position.y = -1.5;

        shadowGenerator.addShadowCaster(rex);

        rex_skeleton = skeletons[0];
        console.log("skeleton imported:", rex_skeleton);

        rex.parent = RexBoundingBox;

        //RexBoundingBox.showBoundingBox = true;
        rex_bounding=newMeshes[1];

        RexBoundingBox.physicsImpostor = new BABYLON.PhysicsImpostor(RexBoundingBox, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 60, restitution: 0});
		RexBoundingBox.physicsImpostor.physicsBody.inertia.setZero();
		RexBoundingBox.physicsImpostor.physicsBody.invInertia.setZero();
		RexBoundingBox.physicsImpostor.physicsBody.invInertiaWorld.setZero();

        //scene.stopAllAnimations();

		camera.target = RexBoundingBox;

        // DEBUGGIN SKELETON VIEWER
		//var skeletonViewer = new BABYLON.Debug.SkeletonViewer(rex_skeleton, rex, scene);
		//skeletonViewer.isEnabled = true; // Enable it
		//skeletonViewer.color = BABYLON.Color3.Red(); // Change default color from white to red

        for(i=0;i<72;i++){
            rex_skeleton.bones[i].linkTransformNode(null); 
        }
       
        INSPECTOR
        scene.debugLayer.show({
            embedMode:true
        });

        //INITIAL POSITION
        //rex_skeleton.bones[42].rotate(BABYLON.Axis.Z, -44.7, BABYLON.Space.LOCAL);  //Left Up Leg
        rex_skeleton.bones[42].rotate(BABYLON.Axis.Z, -44, BABYLON.Space.LOCAL);  //Left Up Leg
        rex_skeleton.bones[43].rotate(BABYLON.Axis.Z, 1, BABYLON.Space.LOCAL);  //Left Leg
        rex_skeleton.bones[53].rotate(BABYLON.Axis.Z, -150, BABYLON.Space.LOCAL); //Right Up Leg
        rex_skeleton.bones[50].rotate(BABYLON.Axis.Z, -150, BABYLON.Space.LOCAL); //LeftFootIndex1
        rex_skeleton.bones[48].rotate(BABYLON.Axis.Z, -150, BABYLON.Space.LOCAL); //LeftFootMiddle1
        rex_skeleton.bones[46].rotate(BABYLON.Axis.Z, -150, BABYLON.Space.LOCAL); //LeftFootRight1
        rex_skeleton.bones[51].rotate(BABYLON.Axis.Z, 45.5, BABYLON.Space.LOCAL); //LeftFootIndex2
        rex_skeleton.bones[49].rotate(BABYLON.Axis.Z, 45.5, BABYLON.Space.LOCAL); //LeftFootMiddle2
        rex_skeleton.bones[47].rotate(BABYLON.Axis.Z, -150, BABYLON.Space.LOCAL); //LeftFootRight2


        
        scene.registerBeforeRender(function () {
			var dir = camera.getTarget().subtract(camera.position);
				dir.y = -RexBoundingBox.getDirection(new BABYLON.Vector3(0, 0, 1)).y;
				dir.z = dir.z;
				dir.x = dir.x;
                RexBoundingBox.setDirection(dir);
                RexBoundingBox.physicsImpostor.registerOnPhysicsCollide(ground.physicsImpostor, function() {
                    jump = 0;
                });
                RexBoundingBox.physicsImpostor.registerOnPhysicsCollide(rockTask.physicsImpostor, function() {
                    jump = 0;
                });
                RexBoundingBox.physicsImpostor.registerOnPhysicsCollide(tronco.physicsImpostor, function() {
                    jump = 0;
                });
                RexBoundingBox.physicsImpostor.registerOnPhysicsCollide(LogBoundingBox.physicsImpostor, function() {
                    jump = 0;
                });
                RexBoundingBox.physicsImpostor.registerOnPhysicsCollide(LogBoundingBox3.physicsImpostor, function() {
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
        if(roar_anim == 1){
            if(RoarCounter>40){
                change_roar = true;
            }else if(RoarCounter<0){
                change_roar = false;
                roar_anim = 0;
            }
            if(!change_roar){
                rex_skeleton.bones[6].rotate(BABYLON.Axis.Z, -speed/50, BABYLON.Space.LOCAL); //Neck
                RoarCounter++;
            }
            else{
                rex_skeleton.bones[6].rotate(BABYLON.Axis.Z, speed/50, BABYLON.Space.LOCAL); //Neck
                RoarCounter--;
            }
        }
        if(!change){

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
        //console.log(walkStepsCounter);
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
        //console.log(walkBackStepsCounter);
	};
    var walk_speed = 1.5;

    //WALK
    scene.registerAfterRender(function () {
        number_image.source = number_url;
        sceneOptimizer.start();
        if(num_eggs == 0){
            music.stop();
            Winning = WINNING_Scene();
            changescene = 4;
        }
		if ((map["w"] || map["W"])) {
			RexBoundingBox.translate(BABYLON.Axis.Z, walk_speed, BABYLON.Space.LOCAL);
			walkForward(walk_speed);
		}
		if ((map["s"] || map["S"])) {
			RexBoundingBox.translate(BABYLON.Axis.Z, -walk_speed, BABYLON.Space.LOCAL);
			walkBack(walk_speed);
		}
        if (map[" "] && jump == 0){
            RexBoundingBox.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 5000, 0), RexBoundingBox.getAbsolutePosition());
            jump=1;
        }

        if(RexBoundingBox.intersectsMesh(egg,true,false)){
                URL_Eggs();
                egg.isVisible = false;
                egg.position.y = -1000;
                roar.play();
                //egg.dispose();
                console.log("Intersection");

                roar_anim = 1;
                num_eggs--;
        }
        if(RexBoundingBox.intersectsMesh(egg3,true,false)){

            if(intersct_egg3 == 0){
                URL_Eggs();
                egg3.dispose();
                roar.play();
                console.log("Intersection3");

                roar_anim = 1;
                num_eggs--;
                }
                intersct_egg3++;
        }
        if(rex_bounding.intersectsMesh(egg2,true,false)){

            if(intersct_egg2 == 0){
                URL_Eggs();
                egg2.dispose();
                roar.play();
                console.log("Intersection2");

                roar_anim = 1;
                num_eggs--;
                }
                intersct_egg2++;
        }
        if(rex_bounding.intersectsMesh(egg5,true,false)){

            if(intersct_egg5 == 0){
                URL_Eggs();
                egg5.dispose();
                roar.play();
                console.log("Intersection5");

                roar_anim = 1;
                num_eggs--;
                }
                intersct_egg5++;
        }

        if(selected_difficulty != easy){            
            if(rex_bounding.intersectsMesh(egg4,true,false)){

                if(intersct_egg4 == 0){
                    URL_Eggs();
                    egg4.dispose();
                    roar.play();
                    console.log("Intersection4");

                    roar_anim = 1;
                    num_eggs--;
                    }
                    intersct_egg4++;
            }
        }

        if(selected_difficulty == impossible){
            if(rex_bounding.intersectsMesh(egg6,true,false)){

                if(intersct_egg6 == 0){
                    URL_Eggs();
                    egg6.dispose();
                    roar.play();
                    console.log("Intersection6");

                    roar_anim = 1;
                    num_eggs--;
                    }
                    intersct_egg6++;
            }
        }
    });

    if(call_forest == 0){
        counterId = setInterval(() => {
            if(countdown_game != 0){ 
                countdown_game--;
                Countdown.text = String(countdown_game) + " s";
            }
        }, 1000);
        call_forest++;
    }

    console.log(counterId);

    engine.hideLoadingUI();
    
    

    return scene;
}

var WINNING_Scene = function (){
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI/4, Math.PI/4, 3, new BABYLON.Vector3(0, 0, 0), scene);
    camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius = 3;
    camera.lowerAlphaLimit = camera.upperAlphaLimit = camera.alpha = null;
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    var music = new BABYLON.Sound("Win", "sounds/win.wav", scene, null, {
        autoplay: true,
        volume: 0.2
    });

    var WinningGui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("WinningUI");

    var Win = new BABYLON.GUI.TextBlock("Win","YOU WIN!"); 
    Win.color = "Red";
    Win.fontFamily = "My Font";
    //Lose.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    Win.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    Win.fontSize = "150px";
    Win.paddingLeft = "-32px";
    Win.paddingRight = "32px";
    Win.paddingTop = "5px";
    Win.paddingBottom = "-5px";
    Win.resizeToFit = true;

    var rect1 = new BABYLON.GUI.Rectangle();
    rect1.width = "70%";
    rect1.height = "70%";
    rect1.paddingLeft = "-32px";
    rect1.paddingRight = "2px";
    rect1.paddingTop = "5px";
    rect1.paddingBottom = "-5px";
    rect1.background = "white";

    const restartBtn = BABYLON.GUI.Button.CreateSimpleButton("restart_win", "RESTART");
    restartBtn.width = 0.2;
    restartBtn.height = 0.2;
    restartBtn.fontFamily = "My Font";
    //restartBtn.height = "40px";
    restartBtn.color = "red";
    restartBtn.top = "-14px";
    restartBtn.fontSize = 50;
    restartBtn.thickness = 0;
    restartBtn.background = "grey";
    restartBtn.right = "13%";
	restartBtn.left = "-13%";
    restartBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    rect1.addControl(restartBtn);

    const MenuBtn = BABYLON.GUI.Button.CreateSimpleButton("Menu", "MENU");
    MenuBtn.width = 0.2;
    MenuBtn.height = 0.2;
    MenuBtn.fontFamily = "My Font";
    //MenuBtn.height = "40px";
    MenuBtn.color = "red";
    MenuBtn.top = "-14px";
    MenuBtn.fontSize = 50;
    MenuBtn.thickness = 0;
    MenuBtn.background = "grey";
    MenuBtn.right = "-13%";
	MenuBtn.left = "13%";
    MenuBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    rect1.addControl(MenuBtn);


    WinningGui.addControl(rect1);
    WinningGui.addControl(Win);

    restartBtn.onPointerUpObservable.addOnce(function () {
        clearInterval(counterId);
        jump=0;
        walkStepsCounter = 0;
        walkBackStepsCounter = 0;
        outOfPosition = false;
        alreadyWalking = false;
        change = false;
        change_back = false;
        num_eggs = eggs_level;

        intersct_egg = 0;
        intersct_egg2 = 0;
        intersct_egg3 = 0;
        intersct_egg4 = 0;
        intersct_egg5 = 0;

        if(selected_difficulty == impossible){
            intersct_egg6 = 0;
        }

        console.log("clickedRestartWin");

        up_down_egg = 0;
        change_egg = false;

        countdown_game = selected_difficulty;

        // Check if the first time call the function FOREST_Scene
        call_forest = 0;
        Forest = FOREST_Scene(); 
        changescene = 2;   
    });

    MenuBtn.onPointerUpObservable.addOnce(function () {
        clearInterval(counterId);
        jump=0;
        walkStepsCounter = 0;
        walkBackStepsCounter = 0;
        outOfPosition = false;
        alreadyWalking = false;
        change = false;
        change_back = false;
        num_eggs = 5;

        intersct_egg = 0;
        intersct_egg2 = 0;
        intersct_egg3 = 0;
        intersct_egg4 = 0;
        intersct_egg6 = 0;
        intersct_egg5 = 0;

        console.log("clickedMenu");

        up_down_egg = 0;
        change_egg = false;

        countdown_game = medium;

        // Check if the first time call the function FOREST_Scene
        call_forest = 0;
        Menu = MainMenu(); 
        changescene = 0;   
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

    var music = new BABYLON.Sound("Lose", "sounds/lose.wav", scene, null, {
        autoplay: true,
        volume: 0.2
    });

    var loseGui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var Lose = new BABYLON.GUI.TextBlock("Lose","YOU LOSE"); 
    Lose.color = "white";
    Lose.fontFamily = "My Font";
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
    restartBtn.fontFamily = "My Font";
    //restartBtn.height = "40px";
    restartBtn.color = "black";
    restartBtn.top = "-14px";
    restartBtn.fontSize = 50;
    restartBtn.thickness = 0;
    restartBtn.background = "white";
    //restartBtn.width = "12%";
	//restartBtn.height = "9%";
	restartBtn.right = "13%";
	restartBtn.left = "-13%";
    restartBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    //restartBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    rect1.addControl(restartBtn);

    const MenuBtn = BABYLON.GUI.Button.CreateSimpleButton("Menu", "MENU");
    MenuBtn.width = 0.2;
    MenuBtn.height = 0.2;
    MenuBtn.fontFamily = "My Font";
    //MenuBtn.height = "40px";
    MenuBtn.color = "black";
    MenuBtn.top = "-14px";
    MenuBtn.fontSize = 50;
    MenuBtn.thickness = 0;
    MenuBtn.background = "white";
    MenuBtn.right = "-13%";
	MenuBtn.left = "13%";
    MenuBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    rect1.addControl(MenuBtn);


    loseGui.addControl(rect1);
    loseGui.addControl(Lose);

    restartBtn.onPointerUpObservable.addOnce(function () {
        clearInterval(counterId);
        jump=0;
        walkStepsCounter = 0;
        walkBackStepsCounter = 0;
        outOfPosition = false;
        alreadyWalking = false;
        change = false;
        change_back = false;
        num_eggs = eggs_level;

        intersct_egg = 0;
        intersct_egg2 = 0;
        intersct_egg3 = 0;
        intersct_egg4 = 0;
        intersct_egg5 = 0;

        if(selected_difficulty == impossible){
            intersct_egg6 = 0;
        }

        console.log("clickedRestart");

        up_down_egg = 0;
        change_egg = false;

        countdown_game = selected_difficulty;

        // Check if the first time call the function FOREST_Scene
        call_forest = 0;
        Forest = FOREST_Scene(); 
        changescene = 2;   
    });

    MenuBtn.onPointerUpObservable.addOnce(function () {
        clearInterval(counterId);
        jump = 0;
        walkStepsCounter = 0;
        walkBackStepsCounter = 0;
        outOfPosition = false;
        alreadyWalking = false;
        change = false;
        change_back = false;
        num_eggs = 5;

        intersct_egg = 0;
        intersct_egg2 = 0;
        intersct_egg3 = 0;
        intersct_egg4 = 0;
        intersct_egg5 = 0;
        intersct_egg6 = 0;

        console.log("clickedMenu");

        up_down_egg = 0;
        change_egg = false;

        countdown_game = medium;

        // Check if the first time call the function FOREST_Scene
        call_forest = 0;
        Menu = MainMenu(); 
        changescene = 0;   
    });

    return scene;
}

var LOADING_Scene = function(){
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0,0,0); 

    var camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI/4, Math.PI/4, 3, new BABYLON.Vector3(0, 0, 0), scene);
    camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius = 3;
    camera.lowerAlphaLimit = camera.upperAlphaLimit = camera.alpha = null;
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    // light
    var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 0, 0), scene);
    light.intensity = 1;
    light.groundColor = new BABYLON.Color3(1,1,1);
    light.specular = BABYLON.Color3.Black();
    light.parent=camera;

    //Earth sphere
    var earth = BABYLON.MeshBuilder.CreateSphere("earth", {diameter: 1}, scene);
    earth.isPickable = false;
    earth.position.x = 0;
    earth.position.y = 0;
    earth.position.z = 0;

    //Fix the sphere as target
    camera.lockedTarget = earth;
    
    //Earth texture
    var earthMaterial = new BABYLON.StandardMaterial("ground", scene);
    earthMaterial.diffuseTexture = new BABYLON.Texture("textures/earth.jpg", scene);
    earth.material = earthMaterial;

    var loadGui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var Loading = new BABYLON.GUI.TextBlock("Loading","LOADING ... "); 
    Loading.color = "white";
    Loading.fontFamily = "My Font";
    //Lose.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    Loading.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    Loading.fontSize = "74px";
    Loading.paddingLeft = "-32px";
    LoadingpaddingRight = "32px";
    Loading.paddingTop = "5px";
    Loading.paddingBottom = "-5px";
    Loading.resizeToFit = true;

    //loadGui.addControl(rect1);
    loadGui.addControl(Loading);

    var textblock_goal = new BABYLON.GUI.TextBlock();
        //textblock_goal.paddingLeft = "1200px";
        //textblock_goal.paddingRight = "2px";
        textblock_goal.paddingTop = "70%";
        //textblock_goal.paddingBottom = "-5px";
        textblock_goal.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        textblock_goal.height = "350px";
        textblock_goal.width = "770px";
        textblock_goal.resizeToFit = true;
        textblock_goal.fontSize = "46px";
        textblock_goal.fontFamily = "My Font";
        textblock_goal.text = "Find\n all the eggs before the \n time runs out !!!";
        textblock_goal.color = "white";
        loadGui.addControl(textblock_goal);



    scene.registerAfterRender( function () {
        earth.rotation = new BABYLON.Vector3(0, Math.PI/6, 0);
    });

    return scene;
}

var Load = LOADING_Scene();

engine.runRenderLoop(function (){
    fps.innerHTML = engine.getFps().toFixed() + " fps";
    if (changescene == 0){
        if ((Menu.getWaitingItemsCount() == 0)  && Load.getWaitingItemsCount() == 0)  {
            window.document.getElementById("loadingBar").style.visibility = "hidden";
            engine.hideLoadingUI();
            Menu.render();
            window.document.getElementById("loadingBar").style.visibility = "hidden";
        } else {
            window.document.getElementById("loadingBar").style.visibility = "visible";
            engine.displayLoadingUI();
        }
    } else if (changescene == 2){
        if (Forest.getWaitingItemsCount() == 0) {
            Load.dispose();
            Forest.render();
        } else {
           Load = LOADING_Scene();
           Menu.dispose();
           Load.render();
	    }
    } else if (changescene == 3){
        Forest.dispose();
        Lose.render();
    } else if (changescene == 4){
        Forest.dispose();
        Winning.render();
    }
});