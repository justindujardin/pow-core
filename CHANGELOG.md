<a name="0.3.0"></a>
## 0.3.0 (2015-11-28)


#### Bug Fixes

* **AudioResource:** detect system audio types and add aac support ([1cc95c7f](http://github.com/justindujardin/pow-core/commit/1cc95c7f0d906b8ec46ca56f71e4a1552637a720))


#### Features

* replace events class with observable implementation ([9a41d17e](http://github.com/justindujardin/pow-core/commit/9a41d17e6204ea0b727275bf765b1a63e81ecbe3))
* **AudioResource:**
  * support identifying formats with multiple mime-types ([146a963b](http://github.com/justindujardin/pow-core/commit/146a963b6845e9a29452375443d73c4ddee5a3a1))
  * use AudioContext API when available ([1aaa829e](http://github.com/justindujardin/pow-core/commit/1aaa829e918fb5e56f91969d723c61d35efe480a))
* **README:** add sauce labs build matrix ([7963313c](http://github.com/justindujardin/pow-core/commit/7963313c59135beb90f7b292d354b19e9fb94527))
* **Resource:** Promise based resource loading api ([fd7883cd](http://github.com/justindujardin/pow-core/commit/fd7883cd058d04d063eed097cd161414b877e14d))
* **Sauce:** expand browser coverage considerably ([3d389530](http://github.com/justindujardin/pow-core/commit/3d38953056d645b3bf68a2ed51a6db631f8c27c9))
* **entities:** load entity constructors from es6 module imports ([53169d1e](http://github.com/justindujardin/pow-core/commit/53169d1e4eb61d08aa7d7917ae9d63f6ef16bd2a))
* **resourceLoader:** use templates to simplify load api ([daf201f4](http://github.com/justindujardin/pow-core/commit/daf201f44864231978b87f03c1359670847af947))


#### Breaking Changes

* entity file extension changed from 'powEntities' to lowercase 'entities' to avoid case-sensitivity problems.
 ([daf201f4](http://github.com/justindujardin/pow-core/commit/daf201f44864231978b87f03c1359670847af947))


<a name="0.2.1"></a>
### 0.2.1 (2015-08-08)


#### Features

* **entity:** extend events class ([d767e32b](http://github.com/justindujardin/pow-core/commit/d767e32b013e661a097c7e99c9a460c89b90efef))


<a name="0.2.0"></a>
## 0.2.0 (2015-08-08)


#### Bug Fixes

* events test typescript compile error ([f76e091b](http://github.com/justindujardin/pow-core/commit/f76e091bd787678d8ddcbc6dd7267bdb6629bbaf))


#### Features

* add editorconfig file for file indentation and formatting ([d4f5c0b7](http://github.com/justindujardin/pow-core/commit/d4f5c0b76f0931d1eb628b5311a77b948a1df88e))
* **build:** use Travis container based infratstructure ([ae194278](http://github.com/justindujardin/pow-core/commit/ae1942785f16aca42bf06f87d1e6a1fcc27059db))


<a name="0.1.9"></a>
### 0.1.9 (2015-04-18)


#### Bug Fixes

* **time:** actually stop the raf when time.stop is called ([9b12b0fc](http://github.com/justindujardin/pow-core/commit/9b12b0fc513f55d682678fa21c7f2ef88c36d264))


<a name="0.1.8"></a>
### 0.1.8 (2015-01-04)


<a name="0.1.7"></a>
### 0.1.7 (2014-10-19)


<a name="0.1.6"></a>
### 0.1.6 (2014-10-19)


<a name="0.1.5"></a>
### 0.1.5 (2014-09-23)


#### Features

* **TiledTMX:** support serialization of tiled map file ([49a4a312](http://github.com/justindujardin/pow-core/commit/49a4a3125918f5486537b609b53f4e271142d9d0))


<a name="0.1.4"></a>
### 0.1.4 (2014-09-07)


#### Bug Fixes

* **Time:** issue #1 generate unique id to reduce boilerplate ([880ffbd5](http://github.com/justindujardin/pow-core/commit/880ffbd5634e3a19ea719ea7710bb6fc7763f9ad))


<a name="0.1.3"></a>
### 0.1.3 (2014-08-16)


#### Bug Fixes

* **TiledTMX:** support more proper inherited paths in TMX ([239a3859](http://github.com/justindujardin/pow-core/commit/239a3859a544e565b6a7abe1b564833326e095d1))


<a name="0.1.2"></a>
### 0.1.2 (2014-08-16)


#### Bug Fixes

* **ResourceLoader:** throw a sane error if create is given a bad constructor ([1d6dd426](http://github.com/justindujardin/pow-core/commit/1d6dd4261df6726d2c5bf5455b39dba383128a73))


#### Features

* **Tiled:**
  * updates to tiled implementation from pow-edit ([7c8e0dc6](http://github.com/justindujardin/pow-core/commit/7c8e0dc6bf7f7264362eb98a650bb06cdc04c31c))
  * updates to tiled implementation from pow-edit ([a4a9b9bd](http://github.com/justindujardin/pow-core/commit/a4a9b9bd04e56574323b08cd5913fdd56e1f2c1b))


<a name="0.1.1"></a>
### 0.1.1 (2014-08-16)


#### Bug Fixes

* **ResourceLoader:** throw a sane error if create is given a bad constructor ([da3600e8](http://github.com/justindujardin/pow-core/commit/da3600e82cbba1e52a82c9e904241824b08aa47d))


#### Features

* **Tiled:**
  * updates to tiled implementation from pow-edit ([283de09c](http://github.com/justindujardin/pow-core/commit/283de09cf63083e9c6e8a91c431b2d9621e6dad5))
  * updates to tiled implementation from pow-edit ([9babe959](http://github.com/justindujardin/pow-core/commit/9babe959ebf710cf3cd5c51d46636167b0ebace0))


<a name="0.1.0"></a>
## 0.1.0 (2014-08-09)


<a name="0.0.8"></a>
### 0.0.8 (2014-08-09)


#### Features

* **release:** push removed artifacts to origin when done ([886a568f](http://github.com/justindujardin/pow-core/commit/886a568fd0a96c31dfe303a7e75983cab912a34f))


<a name="0.0.7"></a>
### 0.0.7 (2014-08-09)


#### Bug Fixes

* **TiledTSXResource:** trigger a failure when image source is invalid ([2e954848](http://github.com/justindujardin/pow-core/commit/2e9548482fc925dab127959eb82a6ab25476f6bb))


#### Features

* **Tiled:** attach reference to original xml dom for each tiledbase ([4bcb2548](http://github.com/justindujardin/pow-core/commit/4bcb2548a0465eb6d494bb0da3a742877e10eeb8))
* **grunt:** add artifacts task for generating tag release outputs ([7a9e772c](http://github.com/justindujardin/pow-core/commit/7a9e772c12611f63c510b95729f232fe9801938f))


<a name="0.0.6"></a>
### 0.0.6 (2014-08-03)


#### Bug Fixes

* **AudioResource:** fewer expected failures if browser lacks type support ([43d94043](http://github.com/justindujardin/pow-core/commit/43d940434720891a76666e4c41527aa72def767d))
* **build:** tell travis to use a recent version of FireFox ([9969cab8](http://github.com/justindujardin/pow-core/commit/9969cab85c80e72c046945e2bd4c537f53882571))


#### Features

* add support for coveralls code coverage reporting ([26a25fd2](http://github.com/justindujardin/pow-core/commit/26a25fd21484d40b9d0152b6d7a827475fdde649))


<a name="0.0.5"></a>
### 0.0.5 (2014-08-02)


#### Bug Fixes

* **Tiled:** actually build in the source files ([500934f2](http://github.com/justindujardin/pow-core/commit/500934f2563bde92e3066e740c456993b471e897))


<a name="0.0.4"></a>
### 0.0.4 (2014-08-02)


#### Features

* **Tiled:** add tiled map format resources to pow-core ([66f988a8](http://github.com/justindujardin/pow-core/commit/66f988a8b80167df20b8d9e7856263ca5f2f52e5))


<a name="0.0.3"></a>
### 0.0.3 (2014-08-02)


#### Bug Fixes

* **bower:**
  * remove direct references to jquery.d.ts file in pow-core ([c1f433cd](http://github.com/justindujardin/pow-core/commit/c1f433cd218fd977997cdef2cc6fb86a43abbf16))
  * remove direct references to d.ts files in pow-core ([560529e0](http://github.com/justindujardin/pow-core/commit/560529e0ca9d5fa03baea710cf39d0f22dfd8560))
* **world:** declare World constructor arg optional ([538eca02](http://github.com/justindujardin/pow-core/commit/538eca0230d11d06c7617b71656e829736acf014))


<a name="0.0.2"></a>
### 0.0.2 (2014-08-02)


#### Features

* **build:** support automated release tasks via `grunt release` ([98c8a5f3](http://github.com/justindujardin/pow-core/commit/98c8a5f345b4616b525fd7515a797e52c371e722))


<a name="0.0.1"></a>
### 0.0.1 (2014-08-02)


#### Features

* **build:** support automated release tasks via `grunt release` ([98c8a5f3](http://github.com/justindujardin/pow-core/commit/98c8a5f345b4616b525fd7515a797e52c371e722))


<a name="0.0.2"></a>
### 0.0.2 (2014-08-02)


<a name="0.0.1"></a>
### 0.0.1 (2014-08-02)


