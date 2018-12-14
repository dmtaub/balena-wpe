(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("clib.coffee", function(exports, require, module) {
var App, PineTree, Tree, angularDamping, brown, jumpVelocity, linearDamping, linearFactor, maxVector, minVector, newTree, randomIntBetween, rotationalFactor,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

require('three.terrain.js');

linearDamping = 0.5;

angularDamping = 0.8;

jumpVelocity = 22;

linearFactor = 0.6;

rotationalFactor = 20;

maxVector = new THREE.Vector3(20, 5000, 20);

minVector = maxVector.clone().multiplyScalar(-1);

brown = 0x875f2d;

randomIntBetween = function(a, b) {
  var range;
  range = (b - a) + 1;
  return b - Math.round(Math.random() * range - 0.5);
};

Tree = (function() {
  Tree.prototype.weight = 9;

  Tree.prototype.barkColor = brown;

  Tree.prototype.fallOver = function(speedOfBall) {
    return console.log("OUCH!");
  };

  function Tree() {
    this.weight = randomIntBetween(6, 10);
  }

  return Tree;

})();

PineTree = (function(superClass) {
  extend(PineTree, superClass);

  function PineTree() {
    return PineTree.__super__.constructor.apply(this, arguments);
  }

  PineTree.prototype.weight = 20;

  return PineTree;

})(Tree);

newTree = new Tree();

App = (function() {
  var GenTerrain;

  function App() {
    this.createShape = bind(this.createShape, this);
    this.render = bind(this.render, this);
    this.moveWithKeys = bind(this.moveWithKeys, this);
    this.initScene = bind(this.initScene, this);
    console.log("hello coffee");
    this.initScene();
    window.addEventListener('resize', ((function(_this) {
      return function() {
        _this.camera.aspect = window.innerWidth / window.innerHeight;
        _this.camera.updateProjectionMatrix();
        return _this.renderer.setSize(window.innerWidth, window.innerHeight);
      };
    })(this)), false);
  }

  App.prototype.initScene = function() {
    var ground, light, x;
    TWEEN.start();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMapSoft = true;
    document.getElementById('viewport').appendChild(this.renderer.domElement);
    this.scene = new Physijs.Scene({
      fixedTimeStep: 1 / 60
    });
    this.scene.setGravity(new THREE.Vector3(0, -40, 0));
    this.scene.addEventListener('update', (function(_this) {
      return function() {
        var x, y, z;
        _this.scene.simulate(void 0, 1);
        if (_this.playerCamera) {
          x = _this.player.position.x + 20;
          y = _this.player.position.y + 20;
          z = _this.player.position.z + 20;
          _this.camera.position.set(x, y, z);
          _this.camera.lookAt(_this.player.position);
        }
        if (_this.player.position.y < -20) {
          _this.scene.remove(_this.player);
          _this.player = _this.createShape();
          _this.scene.add(_this.player);
        }
      };
    })(this));
    x = 2.5;
    this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.set(60 * x, 50 * x, 60 * x);
    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);
    this.playerCamera = false;
    kd.ESC.up((function(_this) {
      return function() {
        if (_this.playerCamera) {
          _this.playerCamera = false;
          _this.camera.position.set(60 * x, 50 * x, 60 * x);
          return _this.camera.lookAt(_this.scene.position);
        } else {
          return _this.playerCamera = true;
        }
      };
    })(this));
    light = new THREE.DirectionalLight(0xFFFFFF);
    light.position.set(20, 40, -15);
    light.target.position.copy(this.scene.position);
    light.castShadow = true;
    light.shadow.camera.left = -60;
    light.shadow.camera.top = -60;
    light.shadow.camera.right = 60;
    light.shadow.camera.bottom = 60;
    light.shadow.camera.near = 20;
    light.shadow.camera.far = 200;
    light.shadow.bias = -.0001;
    light.shadow.mapSize.width = light.shadow.mapSize.height = 2048;
    this.scene.add(light);
    ground = new GenTerrain(this.scene, (function(_this) {
      return function() {
        requestAnimationFrame(_this.render);
        _this.scene.simulate();
        _this.player = _this.createShape();
        _this.player.setDamping(linearDamping, angularDamping);
        return _this.scene.addEventListener('update', _this.moveWithKeys);
      };
    })(this));
  };

  App.prototype.moveWithKeys = function() {
    var contactGround, u3, v3;
    v3 = this.player.getLinearVelocity();
    u3 = this.player.getAngularVelocity();
    contactGround = this.player._physijs.touches.length > 0;
    if (kd.RIGHT.isDown()) {
      v3.x += linearFactor;
      v3.z -= linearFactor;
      if (contactGround) {
        u3.x -= rotationalFactor;
        u3.z -= rotationalFactor;
      } else {
        u3.x = 0;
        u3.z = 0;
      }
    }
    if (kd.LEFT.isDown()) {
      v3.x -= linearFactor;
      v3.z += linearFactor;
      if (contactGround) {
        u3.x += rotationalFactor;
        u3.z += rotationalFactor;
      } else {
        u3.x = 0;
        u3.z = 0;
      }
    }
    if (kd.UP.isDown()) {
      v3.x -= linearFactor;
      v3.z -= linearFactor;
      if (contactGround) {
        u3.x -= rotationalFactor;
        u3.z += rotationalFactor;
      } else {
        u3.x = 0;
        u3.z = 0;
      }
    }
    if (kd.DOWN.isDown()) {
      v3.x += linearFactor;
      v3.z += linearFactor;
      if (contactGround) {
        u3.x += rotationalFactor;
        u3.z -= rotationalFactor;
      } else {
        u3.x = 0;
        u3.z = 0;
      }
    }
    if (kd.SPACE.isDown() && contactGround) {
      v3.y = jumpVelocity;
    }
    u3.clamp(minVector, maxVector);
    v3.clamp(minVector, maxVector);
    this.player.setAngularVelocity(u3);
    this.player.setLinearVelocity(v3);
  };

  App.prototype.render = function() {
    requestAnimationFrame(this.render);
    this.renderer.render(this.scene, this.camera);
  };

  App.prototype.createShape = function() {
    var doCreateShape, sphere_geometry;
    sphere_geometry = new THREE.SphereGeometry(1.5, 32, 32);
    doCreateShape = void 0;
    doCreateShape = (function(_this) {
      return function() {
        var material, shape;
        shape = void 0;
        material = new THREE.MeshLambertMaterial({
          opacity: 0,
          transparent: true
        });
        shape = new Physijs.SphereMesh(sphere_geometry, material, void 0, {
          restitution: Math.random() * 1.5
        });
        shape.material.color.setRGB(Math.random() * 100 / 100, Math.random() * 100 / 100, Math.random() * 100 / 100);
        shape.castShadow = true;
        shape.position.set(Math.random() * 30 - 15, 20, Math.random() * 30 - 15);
        shape.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        _this.scene.add(shape);
        new TWEEN.Tween(shape.material).to({
          opacity: 1
        }, 1500).start();
        return shape;
      };
    })(this);
    return doCreateShape();
  };

  GenTerrain = (function() {
    GenTerrain.TextureLoader = new THREE.TextureLoader();

    GenTerrain.prototype.xS = 63;

    GenTerrain.prototype.yS = 63;

    GenTerrain.prototype.xSize = 128;

    GenTerrain.prototype.ySize = 128;

    GenTerrain.prototype.maxHeight = 30;

    GenTerrain.prototype.minHeight = 20;

    function GenTerrain(scene, afterLoad) {
      this.afterLoad = afterLoad;
      this.addEarth = bind(this.addEarth, this);
      this.regenerate = bind(this.regenerate, this);
      this.addSky = bind(this.addSky, this);
      this.scatterMeshes = bind(this.scatterMeshes, this);
      this.addDefault = bind(this.addDefault, this);
      this.addEarth(scene, this.afterLoad);
    }

    GenTerrain.prototype.addDefault = function(scene) {
      this.material = new THREE.MeshBasicMaterial({
        color: 0x5566aa
      });
      return this.regenerate(scene);
    };

    GenTerrain.prototype.scatterMeshes = function() {
      var decoScene, geo;
      geo = this.terrainScene.children[0].geometry;
      decoScene = THREE.Terrain.ScatterMeshes(geo, {
        mesh: new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 12, 6)),
        w: this.xS,
        h: this.yS,
        spread: 0.02,
        randomness: Math.random
      });
      return this.terrainScene.add(decoScene);
    };

    GenTerrain.prototype.addSky = function(scene) {
      return GenTerrain.TextureLoader.load('img/sky1.jpg', function(t1) {
        var skyDome;
        t1.minFilter = THREE.LinearFilter;
        skyDome = new THREE.Mesh(new THREE.SphereGeometry(8192 / 12, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), new THREE.MeshBasicMaterial({
          map: t1,
          side: THREE.BackSide,
          fog: false
        }));
        skyDome.position.y = 0;
        skyDome.rotation.x = Math.PI;
        return scene.add(skyDome);
      });
    };

    GenTerrain.prototype.regenerate = function(scene) {
      var ground, ground_geometry, ground_material;
      this.terrainScene = THREE.Terrain({
        easing: THREE.Terrain.Linear,
        frequency: 2.5,
        heightmap: THREE.Terrain.DiamondSquare,
        material: this.material || new THREE.MeshLambertMaterial({
          color: 0x2194ce
        }),
        maxHeight: this.maxHeight,
        minHeight: -this.minHeight,
        steps: 10,
        useBufferGeometry: false,
        xSegments: this.xS,
        xSize: this.xSize,
        ySegments: this.yS,
        ySize: this.ySize
      });
      if (this.terrainScene) {
        scene.remove(this.terrainScene);
      }
      if (ground) {
        scene.remove(ground);
      }
      ground_material = Physijs.createMaterial(new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.02,
        wireframe: true
      }));
      ground_geometry = this.terrainScene.children[0].geometry;
      console.log(ground_geometry);
      ground_geometry.computeFaceNormals();
      ground_geometry.computeVertexNormals();
      ground = new Physijs.HeightfieldMesh(ground_geometry, ground_material, 0, this.xS, this.yS);
      ground.rotation.x = Math.PI / -2;
      this.terrainScene.children[0].receiveShadow = true;
      scene.add(ground);
      return scene.add(this.terrainScene);
    };

    GenTerrain.prototype.addEarth = function(scene, cb) {
      var loader;
      loader = GenTerrain.TextureLoader;
      return loader.load('img/sand1.jpg', (function(_this) {
        return function(t1) {
          return loader.load('img/grass1.jpg', function(t2) {
            return loader.load('img/stone1.jpg', function(t3) {
              return loader.load('img/snow1.jpg', function(t4) {
                _this.material = THREE.Terrain.generateBlendedMaterial([
                  {
                    texture: t1
                  }, {
                    texture: t2,
                    levels: [-15, -10, -5, 0]
                  }, {
                    texture: t3,
                    levels: [-20, 0, 10, 15]
                  }, {
                    texture: t4,
                    glsl: '1.0 - smoothstep(5.0 + smoothstep(-256.0, 256.0, vPosition.x) * 10.0, 28.0, vPosition.z)'
                  }, {
                    texture: t3,
                    glsl: 'slope > 0.7853981633974483 ? 0.2 : 1.0 - smoothstep(0.47123889803846897, 0.7853981633974483, slope) + 0.2'
                  }
                ]);
                _this.regenerate(scene);
                if (cb) {
                  return cb();
                }
              });
            });
          });
        };
      })(this));
    };

    return GenTerrain;

  })();

  return App;

})();

module.exports = App;
});

;require.register("initialize.js", function(exports, require, module) {
App = require('clib');

document.addEventListener('DOMContentLoaded', function() {
  // do your setup here
  console.log('Initialized brunch app');
  new App();
});

});

require.alias("buffer/index.js", "buffer");require.register("___globals___", function(exports, require, module) {
  

// Auto-loaded modules from config.npm.globals.
window.THREE = require("three");


});})();require('___globals___');


//# sourceMappingURL=app.js.map