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
    
    const Myrock2 = Myrock.clone("Myrock2");
    Myrock2.position.x = -85;
    Myrock2.position.z = 75;
    const Myrock3 = Myrock.clone("Myrock3");
    Myrock3.position.x = -85;
    Myrock3.position.z = 90;
    Myrock3.setDirection(1,0,0);

    
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


    //Import Shark
    BABYLON.SceneLoader.ImportMesh("", "models/", "shark.glb", scene, function(meshes) {
        shark=meshes[0];
        shark.rotation.y = Math.PI;
        camera.target=shark;

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
			dir.y = -dir.y;
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