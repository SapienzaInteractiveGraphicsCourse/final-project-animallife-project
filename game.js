var canvas = document.getElementById("canvas");
var engine = new BABYLON.Engine(canvas,true);

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
            changescene = 1   
         });
     

        engine.hideLoadingUI();

        return main_menu;
}

var Menu = MainMenu();
var Sea;

var SEA_Scene = function(){
    var scene = new BABYLON.Scene(engine);
    scene.collisionEnabled=true;

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
    var camera = new BABYLON.ArcRotateCamera("CameraBaseRotate", -Math.PI/2, Math.PI/2.2, 12, new BABYLON.Vector3(0, 5.0, 0), scene);	
	camera.wheelPrecision = 15;	
	camera.lowerRadiusLimit = 2;
	camera.upperRadiusLimit = 22;
	camera.minZ = 0;
	camera.minX = 4096;
	scene.activeCamera = camera;

    //camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

    camera.checkCollision=true;
    camera.attachControl(canvas, true);

	var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(1, 1, 0), scene);
	light.diffuse = new BABYLON.Color3(1, 1, 1);

    /*
    // Keyboard events
    var inputMap = {};
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    */

	
	// SKYBOX
	var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:350.0}, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/sea", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;		
	
    // // GROUND.  Params: name, width, depth, subdivs, scene
    // var ground = BABYLON.Mesh.CreateGround("ground", 35, 35, 2, scene);
    // var backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene);
    // backgroundMaterial.diffuseTexture = new BABYLON.Texture("textures/sand.jpg", scene);
    // backgroundMaterial.diffuseTexture.uScale = 5.0;//Repeat 5 times on the Vertical Axes
    // backgroundMaterial.diffuseTexture.vScale = 5.0;//Repeat 5 times on the Horizontal Axes
    // backgroundMaterial.shadowLevel = 0.4;
    // ground.material = backgroundMaterial;

    BABYLON.SceneLoader.ImportMesh("", "https://models.babylonjs.com/Demos/UnderWaterScene/ground/", "underwaterGround.glb", scene, function (newMeshes) {
        newMeshes[0].name = "underWaterGround";
        newMeshes[0].scaling.x = 25;
        newMeshes[0].scaling.z = 25;
        let childMeshes = newMeshes[0].getChildMeshes(false);
        for (let i = 0; i < childMeshes.length; i++) {
            childMeshes[i].layerMask = 1;
        }
        BABYLON.NodeMaterial.ParseFromSnippetAsync("XWTJA2", scene).then(nodeMaterial => {
            nodeMaterial.name = "groundMaterial";
            nodeMaterial.vScale = 5;
            nodeMaterial.uScale = 5;
            scene.getMeshByName("ground").material = nodeMaterial;
        });
        newMeshes[0].checkCollision=true;
    });

    BABYLON.SceneLoader.ImportMesh("", "https://models.babylonjs.com/Demos/UnderWaterScene/shadows/", "underwaterSceneShadowCatcher.glb", scene, function (newMeshes) {
        newMeshes[0].name = "underWaterShadowCatcher";
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
        let childMeshes = newMeshes[0].getChildMeshes(false);
        for (let i = 0; i < childMeshes.length; i++) {
            childMeshes[i].layerMask = 1;
            childMeshes[i].checkCollision=true;
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

    var Myrock = BABYLON.MeshBuilder.CreateSphere("Myrock", 
    {
        segments: 30,
        diameterX: Math.random() * 2.5,
        diameterY: Math.random() * 1.5,
        diameterZ: Math.random() * 1.5,
        updatable:true 
    }, scene);

    Myrock.forceSharedVertices();
    Myrock.position.x = 10;
    Myrock.position.y = 1;
    var positions = Myrock.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var numberOfVertices = positions.length/3;	
    for(var i = 0; i<numberOfVertices; i++) {
        positions[i*3] += Math.random() * 0.01;
        positions[i*3+1] += Math.random() * 0.01;
        positions[i*3+2] += Math.random() * 0.01;
    }

    Myrock.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);

    const displacementmapURL = "textures/distortion.jpeg";
    Myrock.applyDisplacementMap(displacementmapURL, 0.1, 1);
    var MyrockMaterial = new BABYLON.BackgroundMaterial("RockMaterial", scene);
    MyrockMaterial.diffuseTexture = new BABYLON.Texture("textures/corallo.jpeg", scene);
    MyrockMaterial.diffuseTexture.uScale = 5.0;//Repeat 5 times on the Vertical Axes
    MyrockMaterial.diffuseTexture.vScale = 5.0;//Repeat 5 times on the Horizontal Axes
    MyrockMaterial.shadowLevel = 0.4;
    Myrock.material = MyrockMaterial;

    var wallNorth=BABYLON.MeshBuilder.CreatePlane("wallNorth", {width: 16, height: 2.7, subdivsions: 1}, scene);
    wallNorth.position.y=1.35;
    wallNorth.position.x=0;
    wallNorth.position.z=-8;
    wallNorth.addRotation(0, Math.PI, 0);
    wallNorth.checkCollisions=true;


    //Import Shark
    BABYLON.SceneLoader.ImportMesh("", "models/", "shark.glb", scene, function(meshes) {
        shark=meshes[0];
        shark.rotation.y = Math.PI;
        camera.target=shark;

        //IMPORTANT
        //shark.parent=camera;
        

        /*
        shark.ellipsoid = new BABYLON.Vector3(0.5, 1.0, 0.5);
        shark.checkCollision=true;
        shark.collisionEnabled=true;
        */

        // targetMesh created here.
        //camera.target = meshes[0]; // version 2.4 and earlier
        //camera.lockedTarget = meshes[0]; //version 2.5 onwards
        
        // WASD control of Player "character".
        //let isWPressed = false;
        //let isAPressed = false;
        //let isSPressed = false;
        //let isDPressed = false;

        /*
        window.addEventListener("mousemove", function () {
            // We try to pick an object
            var pickResult = scene.pick(scene.pointerX, scene.pointerY);
            if (pickResult.hit) {
                shark.lookAt(pickResult.pickedPoint);
            }
        });
        */

        document.addEventListener("keydown", function(ev){
            if(ev.which == 87){//press spacebar to move the player
                speed = .8;
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
			dir.y = -shark.getDirection(new BABYLON.Vector3(0, 1, 0)).y;
			dir.z = -dir.z;
			dir.x = -dir.x;
            shark.setDirection(dir);	
            shark.locallyTranslate(new BABYLON.Vector3(0, 0, speed));
            camera.target.x = parseFloat(shark.position.x);		
            camera.target.z = parseFloat(shark.position.z);	
        });


    });

   


    return scene;
}
engine.runRenderLoop(function (){
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
    }
});

// engine.runRenderLoop(function() {
// 	if(changescene == 0){
        
		
//         scenemenuvar.render();
// 		fpsIndicator.style.visibility = "hidden";
// 		loadingScreenDiv.style.visibility = "hidden";

//   	}
// 	else if (changescene == 1){
//         if (scenevar.getWaitingItemsCount() === 0) {
//             loadingScreenDiv.style.visibility = "hidden";
//             engine.hideLoadingUI();

//             if(comingfromScenelosing){
//             	gameoverscenevar.dispose();
//           		comingfromScenelosing = false;
//             }
//             else if(comingfromScenemenu){
//           		scenemenuvar.dispose();
//           		comingfromScenemenu = false;
//             }
//            	scenevar.render();

//     		fpsIndicator.style.visibility = "visible";
//     		fpsIndicator.innerHTML = "FPS: " + engine.getFps().toFixed();
			
// 			setTimeout(function(){
//       		    boolgamestart = true;
//             }, 5000);

//         } else {
//             loadingScreenDiv.style.visibility = "visible";
//     	    engine.displayLoadingUI();
// 	    }
// 	}
		
//     else if(changescene == 2){
//         scenemenuvar.dispose();
//         scenecommandsvar.render();
//     }
		
//     else if (changescene == 3){
//         scenemenuvar.dispose();
//         aboutscenevar.render();			
//     }
		
//     else if (changescene == 4){    	
//         scenevar.dispose();
//         gameoverscenevar.render();
//         fpsIndicator.style.visibility = "hidden";
//     }
//     else if (changescene == 5){
//         scenevar.dispose();
//         winningScenevar.render();
//         fpsIndicator.style.visibility = "hidden";
//     }
// });