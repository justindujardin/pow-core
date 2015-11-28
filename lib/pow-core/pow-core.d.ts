declare module 'pow-core/errors' {
	/// <reference path="../../types/es6-promise.d.ts" />
	/**
	 * Constant strings for use in throwing Error with messages.  Used to
	 * make checking thrown errors doable without an explosion of Error subclasses.
	 */
	export var errors: {
	    INVALID_ARGUMENTS: string;
	    DIVIDE_ZERO: string;
	    CLASS_NOT_IMPLEMENTED: string;
	    UNSUPPORTED_OPERATION: string;
	    REQUIRED_ARGUMENT: string;
	    ALREADY_EXISTS: string;
	    INDEX_OUT_OF_RANGE: string;
	    INVALID_ITEM: string;
	    COMPONENT_REGISTER_FAIL: string;
	};

}
declare module 'pow-core/api' {
	/**
	 * Module level world accessor.
	 */
	export function getWorld<T>(name: string): T;
	/**
	 * Module level world setter.
	 */
	export function registerWorld(name: string, instance: any): any;
	/**
	 * Module level world remover.
	 */
	export function unregisterWorld(name: string): any;
	export function clearWorlds(): void;

}
declare module 'pow-core/entity' {
	import { IComponent } from 'pow-core/component';
	import { IComponentHost } from 'pow-core/component';
	/**
	 * An Entity object is a container for groups of components.
	 *
	 * Basic composite object that has a set of dynamic behaviors added to it through the
	 * addition and removal of component objects.  Components may be looked up by type, and
	 * may depend on siblings components for parts of their own behavior.
	 */
	export class Entity implements IComponentHost {
	    id: string;
	    name: string;
	    _components: IComponent[];
	    destroy(): void;
	    findComponent(type: Function): IComponent;
	    findComponents(type: Function): IComponent[];
	    findComponentByName(name: string): IComponent;
	    syncComponents(): void;
	    addComponent(component: IComponent, silent?: boolean): boolean;
	    removeComponentByType(componentType: any, silent?: boolean): boolean;
	    removeComponent(component: IComponent, silent?: boolean): boolean;
	}

}
declare module 'pow-core/observable' {
	/**
	 * Determine if a given parameter is an object or not.
	 * @returns {boolean} true if the type is an object.
	 */
	export function isObject(obj: any): boolean;
	/**
	 * An object that generates observable values.
	 */
	export interface IGenerator<T> {
	    /**
	     * Trigger/Receive a value.
	     * @param value
	     */
	    next?(value?: T): void;
	    /**
	     * Trigger/Receive an error.
	     * @param error The error that occurred during execution.
	     */
	    throw?(error: any): void;
	    /**
	     * Trigger/Receive a final value.
	     * @param value An optional value
	     */
	    return?(value?: T): void;
	}
	/**
	 * An object that is observable.  It generates values that
	 * interested parties may consume.  It declares a method to
	 * allow one to `subscribe` to those events.
	 */
	export interface IObservable<T> {
	    /**
	     * Subscribe to changes in value for this object.
	     * @param {@link IGenerator} generator An object that defines the callbacks that
	     *        are to be consumed when a value changes.
	     */
	    subscribe(generator: IGenerator<T>): ISubscription;
	}
	/**
	 * An object that manages the lifetime of a generator that is associated with
	 * an {@link IObservable}.
	 */
	export interface ISubscription {
	    /**
	     * Unsubscribe the {@link IGenerator} associated with this subscription.  The
	     * associated generator will immediately stop receiving values.  Calling this
	     * method multiple times will have no side-effects.
	     */
	    unsubscribe(): void;
	}
	/**
	 * Implementation of an Observable object that conforms to the observable specification.
	 */
	export class Observable<T> implements IObservable<T>, IGenerator<T> {
	    subscribe(generator: IGenerator<T>): ISubscription;
	    next(value?: T): void;
	    throw(error: any): void;
	    return(value?: T): void;
	    private _listeners;
	    private _execute(operation, value?);
	    /**
	     * Remove a generator by its instance.
	     * @param generator The generator to remove.
	     * @private
	     */
	    private _removeGenerator(generator);
	}

}
declare module 'pow-core/component' {
	import { Entity } from 'pow-core/entity';
	/**
	 * Most basic object.  Has an id and a name.
	 */
	export interface IObject {
	    id: string;
	    name: string;
	}
	/**
	 * Basic component interface.  Supports component host lifetime implementations, and
	 * hot-swapping components.
	 */
	export interface IComponent extends IObject {
	    /**
	     * The host object that this component belongs to.
	     */
	    host: IObject;
	    /**
	     * Connect this component to its host.  Initialization logic goes here.
	     */
	    connectComponent(): boolean;
	    /**
	     * Disconnect this component from its host.  Destruction logic goes here.
	     */
	    disconnectComponent(): boolean;
	    /**
	     * Components on the host have changed.  If this component depends on other
	     * host object components, the references to them should be looked up and
	     * stored here.
	     */
	    syncComponent(): boolean;
	}
	/**
	 * Basic component host object interface.  Exposes methods for adding/removing/searching
	 * components that a host owns.
	 */
	export interface IComponentHost extends IObject {
	    addComponent(component: IComponent, silent?: boolean): boolean;
	    removeComponent(component: IComponent, silent?: boolean): boolean;
	    syncComponents(): any;
	    findComponent(type: Function): IComponent;
	    findComponents(type: Function): IComponent[];
	    findComponentByName(name: string): IComponent;
	}
	/**
	 * Simplest ISceneComponent implementation.  Because Typescript interfaces are compile
	 * time constructs, we have to have an actual implementation to instanceof.  For that
	 * reason, all SceneComponents should derive this class.
	 */
	export class Component implements IComponent {
	    id: string;
	    host: Entity;
	    name: string;
	    connectComponent(): boolean;
	    disconnectComponent(): boolean;
	    syncComponent(): boolean;
	    toString(): string;
	}

}
declare module 'pow-core/point' {
	export interface IPoint {
	    x: number;
	    y: number;
	}
	export class Point {
	    x: number;
	    y: number;
	    constructor();
	    constructor(point: Point);
	    constructor(x: number, y: number);
	    constructor(x: string, y: string);
	    toString(): string;
	    set(point: Point): Point;
	    set(x: number, y: number): Point;
	    clone(): Point;
	    floor(): Point;
	    round(): Point;
	    add(x: number, y: number): Point;
	    add(value: number): Point;
	    add(point: Point): Point;
	    subtract(x: number, y: number): Point;
	    subtract(value: number): Point;
	    subtract(point: Point): Point;
	    multiply(x: number, y: number): Point;
	    multiply(value: number): Point;
	    multiply(point: Point): Point;
	    divide(x: number, y: number): Point;
	    divide(value: number): Point;
	    divide(point: Point): Point;
	    inverse(): Point;
	    equal(point: Point): boolean;
	    isZero(): boolean;
	    zero(): Point;
	    interpolate(from: Point, to: Point, factor: number): Point;
	}

}
declare module 'pow-core/rect' {
	import { Point } from 'pow-core/point';
	export interface IRect {
	    point: Point;
	    extent: Point;
	}
	export class Rect implements IRect {
	    point: Point;
	    extent: Point;
	    constructor();
	    constructor(rect: IRect);
	    constructor(point: Point, extent: Point);
	    constructor(x: number, y: number, width: number, height: number);
	    toString(): string;
	    set(rect: IRect): Rect;
	    set(point: Point, extent: Point): Rect;
	    set(x: number, y: number, width: number, height: number): any;
	    clone(): Rect;
	    clip(clipRect: IRect): Rect;
	    isValid(): boolean;
	    intersect(clipRect: IRect): boolean;
	    pointInRect(point: Point): boolean;
	    pointInRect(x: number, y: number): boolean;
	    getCenter(): Point;
	    setCenter(point: Point): Rect;
	    setCenter(x: number, y: number): Rect;
	    getLeft(): number;
	    getTop(): number;
	    getRight(): number;
	    getBottom(): number;
	    getHalfSize(): Point;
	    /**
	     * Add a point to the rect.  This will ensure that the rect
	     * contains the given point.
	     * @param {Point} value The point to add.
	     */
	    addPoint(value: Point): void;
	    inflate(x?: number, y?: number): Rect;
	}

}
declare module 'pow-core/time' {
	export interface IProcessObject {
	    _uid?: string;
	    tick?(elapsed: number): any;
	    processFrame?(elapsed: number): any;
	}
	export class Time {
	    tickRateMS: number;
	    mspf: number;
	    world: any;
	    lastTime: number;
	    time: number;
	    running: boolean;
	    objects: Array<IProcessObject>;
	    constructor();
	    static get(): Time;
	    start(): void;
	    stop(): void;
	    removeObject(object: IProcessObject): void;
	    addObject(object: IProcessObject): void;
	    tickObjects(elapsedMS: number): void;
	    processFrame(elapsedMS: number): void;
	    polyFillAnimationFrames(): void;
	}

}
declare module 'pow-core/world' {
	import { Time } from 'pow-core/time';
	import { ResourceLoader } from 'pow-core/resourceLoader';
	export interface IWorld {
	    loader: ResourceLoader;
	    time: Time;
	    mark(object?: IWorldObject): any;
	    erase(object?: IWorldObject): any;
	    setService(name: string, value: IWorldObject): IWorldObject;
	}
	export interface IWorldObject {
	    world: IWorld;
	    onAddToWorld?(world: IWorld): any;
	    onRemoveFromWorld?(world: IWorld): any;
	}
	export class World implements IWorld {
	    loader: ResourceLoader;
	    time: Time;
	    constructor(services?: any);
	    setService(name: string, value: IWorldObject): IWorldObject;
	    mark(object?: IWorldObject): void;
	    erase(object?: IWorldObject): void;
	}

}
declare module 'pow-core/resources/image' {
	import { Resource } from 'pow-core/resource';
	/**
	 * Use html image element to load an image resource.
	 */
	export class ImageResource extends Resource {
	    data: HTMLImageElement;
	    fetch(url?: string): Promise<ImageResource>;
	}

}
declare module 'pow-core/resources/script' {
	import { Resource } from 'pow-core/resource';
	/**
	 * Use jQuery to load a Javascript file from a URL.
	 */
	export class ScriptResource extends Resource {
	    data: HTMLScriptElement;
	    fetch(url?: string): Promise<ScriptResource>;
	}

}
declare module 'pow-core/resources/json' {
	import { Resource } from 'pow-core/resource';
	/**
	 * Use jQuery to load a JSON file from a URL.
	 */
	export class JSONResource extends Resource {
	    data: any;
	    fetch(url?: string): Promise<JSONResource>;
	}

}
declare module 'pow-core/resources/xml' {
	import { Resource } from 'pow-core/resource';
	/**
	 * Use jQuery to load an XML file from a URL.
	 */
	export class XMLResource extends Resource {
	    data: any;
	    fetch(url: string): Promise<XMLResource>;
	    /**
	     * Load from a given piece of data.
	     */
	    load(data: any): Promise<XMLResource>;
	    getRootNode(tag: string): any;
	    getChildren<T>(el: any, tag: string): T[];
	    getChild<T>(el: any, tag: string): T;
	    getElAttribute(el: any, name: string): any;
	}

}
declare module 'pow-core/resources/entities' {
	import { JSONResource } from 'pow-core/resources/json';
	export enum EntityError {
	    NONE = 0,
	    ENTITY_TYPE = 1,
	    COMPONENT_TYPE = 2,
	    COMPONENT_NAME_DUPLICATE = 4,
	    COMPONENT_REGISTER = 8,
	    COMPONENT_INPUT = 16,
	    INPUT_NAME = 32,
	    INPUT_TYPE = 64,
	}
	/**
	 * Dictionary of name -> type inputs that are used to create various
	 * composite entity objects.
	 */
	export interface IEntityInputsMap {
	    [name: string]: string;
	}
	/**
	 * The basic description of an object that may be instantiated with custom constructor
	 * arguments.
	 */
	export interface IEntityObject {
	    /**
	     * The name of the entity to use when creating.
	     */
	    name: string;
	    /**
	     * The object type to use for the entity.  Assumed to be an [[ISceneObjectComponentHost]] type.
	     */
	    type: string;
	    /**
	     * An array of inputs for the constructor call to the output object of `type`.
	     */
	    params: string[];
	}
	/**
	 * A composite entity template that describes the inputs and outputs of
	 * an entity that may be instantiated.
	 */
	export interface IEntityTemplate extends IEntityObject {
	    /**
	     * A map of named inputs and their types.
	     */
	    inputs: IEntityInputsMap;
	    /**
	     * An array of components to instantiate and add to the output container.
	     */
	    components: IEntityObject[];
	}
	/**
	 * JSON resource describing an array of [[IEntityTemplate]]s that can be used for composite
	 * object creation with validated input types.
	 */
	export class EntityContainerResource extends JSONResource {
	    static IMPORT_SPLITTER: string;
	    /**
	     * Instantiate an object and set of components from a given template.
	     * @param templateName The name of the template in the resource.
	     * @param inputs An object of input values to use when instantiating objects and components.
	     * @returns {*} The resulting object or null
	     */
	    createObject(templateName: string, inputs?: any): Promise<any>;
	    /**
	     * Validate a template object's correctness, returning a string
	     * error if incorrect, or null if correct.
	     *
	     * @param templateData The template to verify
	     * @param inputs
	     */
	    validateTemplate(templateData: any, inputs?: any): Promise<void>;
	    getTemplate(templateName: string): IEntityTemplate;
	    constructObject(constructor: any, argArray: any): any;
	    /**
	     * Do a case-insensitive typeof compare to allow generally simpler
	     * type specifications in entity files.
	     * @param type The type
	     * @param expected The expected typeof result
	     * @returns {boolean} True if the expected type matches the type
	     */
	    typeofCompare(type: any, expected: string): boolean;
	    private _fetchImportModule(importTuple);
	    /**
	     * Type cache for quick look up of imported es6 modules as entity types
	     * @private
	     */
	    static _typesCache: {
	        [fullType: string]: Function;
	    };
	}

}
declare module 'pow-core/resources/tiled/tiled' {
	export interface ITileInstanceMeta {
	    image: HTMLImageElement;
	    url: string;
	    x: number;
	    y: number;
	    width: number;
	    height: number;
	    data?: any;
	}
	export interface ITiledBase {
	    name: string;
	    x: number;
	    y: number;
	    width: number;
	    height: number;
	    visible: boolean;
	    _xml: any;
	}
	export interface ITiledLayerBase extends ITiledBase {
	    opacity: number;
	    properties?: any;
	}
	export interface ITiledLayer extends ITiledLayerBase {
	    data?: any;
	    color?: string;
	    objects?: ITiledObject[];
	}
	export interface ITiledObject extends ITiledBase {
	    properties?: any;
	    rotation?: number;
	    type?: string;
	    gid?: number;
	    color?: string;
	}
	export interface ITileSetDependency {
	    source?: string;
	    data?: any;
	    firstgid: number;
	    literal?: string;
	}
	export function readITiledBase(el: any): ITiledBase;
	export function writeITiledBase(el: any, data: ITiledObject): void;
	export function writeITiledObjectBase(el: any, data: ITiledObject): void;
	export function readITiledObject(el: any): ITiledObject;
	export function readITiledLayerBase(el: any): ITiledLayerBase;
	export function compactUrl(base: string, relative: string): string;
	export function xml2Str(xmlNode: any): any;
	export function writeITiledLayerBase(el: any, data: ITiledLayerBase): void;
	export function readTiledProperties(el: any): {};
	export function writeTiledProperties(el: any, data: any): void;
	export function getChildren(el: any, tag: string): any[];
	export function getChild(el: any, tag: string): any;
	export function setElAttribute(el: any, name: string, value: any): void;
	export function getElAttribute(el: any, name: string): string;

}
declare module 'pow-core/resources/tiled/tiledTsx' {
	import * as tiled from 'pow-core/resources/tiled/tiled';
	import { XMLResource } from 'pow-core/resources/xml';
	import { ImageResource } from 'pow-core/resources/image';
	export class TilesetTile {
	    id: number;
	    properties: any;
	    constructor(id: number);
	}
	/**
	 * A Tiled TSX tileset resource
	 */
	export class TiledTSXResource extends XMLResource {
	    name: string;
	    tilewidth: number;
	    tileheight: number;
	    imageWidth: number;
	    imageHeight: number;
	    image: ImageResource;
	    url: string;
	    firstgid: number;
	    tiles: any[];
	    relativeTo: string;
	    imageUrl: string;
	    literal: string;
	    load(data?: any): Promise<TiledTSXResource>;
	    hasGid(gid: number): boolean;
	    getTileMeta(gidOrIndex: number): tiled.ITileInstanceMeta;
	}

}
declare module 'pow-core/resources/tiled/tiledTmx' {
	import * as tiled from 'pow-core/resources/tiled/tiled';
	import { XMLResource } from 'pow-core/resources/xml';
	import { Resource } from 'pow-core/resource';
	/**
	 * Use jQuery to load a TMX $map file from a URL.
	 */
	export class TiledTMXResource extends XMLResource {
	    $map: any;
	    width: number;
	    height: number;
	    orientation: string;
	    tileheight: number;
	    tilewidth: number;
	    version: number;
	    properties: any;
	    tilesets: any;
	    layers: tiled.ITiledLayer[];
	    xmlHeader: string;
	    write(): any;
	    load(data?: any): Promise<Resource>;
	}

}
declare module 'pow-core/resources/audio' {
	import { Resource } from 'pow-core/resource';
	/**
	 * A supported audio format description that maps extensions to resource types.
	 */
	export interface IAudioFormat {
	    /**
	     * The file extension that corresponds to this format.
	     */
	    extension: string;
	    /**
	     * The media resource type to check against an audio element.
	     */
	    type: string;
	}
	/**
	 * Define an interface for interacting with audio files.
	 */
	export interface IAudioSource {
	    play(): IAudioSource;
	    pause(): IAudioSource;
	    volume: number;
	}
	/**
	 * Use jQuery to load an Audio resource.
	 */
	export class AudioResource extends Resource implements IAudioSource {
	    data: HTMLAudioElement;
	    private static FORMATS;
	    /**
	     * Detect support for audio files of varying types.
	     *
	     * Source: http://diveintohtml5.info/everything.html
	     */
	    static supportedFormats(): IAudioFormat[];
	    private static _context;
	    private static _types;
	    private _source;
	    private _audio;
	    fetch(url?: string): Promise<Resource>;
	    play(when?: number): IAudioSource;
	    pause(): IAudioSource;
	    private _volume;
	    volume: number;
	    private _loadAudioBuffer(formats);
	    private _loadAudioElement(formats);
	}

}
declare module 'pow-core/resourceLoader' {
	import { IResource } from 'pow-core/resource';
	/**
	 * A basic resource loading manager.  Supports a basic api for requesting
	 * resources by file name, and uses registered types and file extension
	 * matching to create and load a resource.
	 */
	export class ResourceLoader {
	    private _cache;
	    private _types;
	    registerType(extension: string, type: Function): void;
	    getResourceExtension(url: string): string;
	    create<T extends IResource>(typeConstructor: any, data?: any): T;
	    loadAsType<T extends IResource>(source: string, resourceType: any): Promise<T>;
	    load<T extends IResource | IResource[]>(sources: Array<string>): Promise<T[]>;
	    load<T extends IResource | IResource[]>(sources: Array<string>): Promise<T[]>;
	    load<T extends IResource | IResource[]>(source: string): Promise<T[]>;
	}

}
declare module 'pow-core/resource' {
	export interface IResource {
	    url: string;
	    data: any;
	    extension: string;
	    fetch(url?: string): Promise<IResource>;
	    load(data?: any): Promise<IResource>;
	}
	/**
	 * Promise based resource loading class. Loads from given URL or data.
	 */
	export class Resource implements IResource {
	    url: string;
	    data: any;
	    extension: string;
	    constructor(url?: string, data?: any);
	    load(data?: any): Promise<Resource>;
	    fetch(url?: string): Promise<Resource>;
	}

}
declare module 'pow-core/all' {
	export * from 'pow-core/api';
	export * from 'pow-core/component';
	export * from 'pow-core/entity';
	export * from 'pow-core/errors';
	export * from 'pow-core/observable';
	export * from 'pow-core/point';
	export * from 'pow-core/rect';
	export * from 'pow-core/resource';
	export * from 'pow-core/resourceLoader';
	export * from 'pow-core/time';
	export * from 'pow-core/world';
	export * from 'pow-core/resources/audio';
	export * from 'pow-core/resources/entities';
	export * from 'pow-core/resources/image';
	export * from 'pow-core/resources/json';
	export * from 'pow-core/resources/script';
	export * from 'pow-core/resources/xml';
	export * from 'pow-core/resources/tiled/tiled';
	export * from 'pow-core/resources/tiled/tiledTmx';
	export * from 'pow-core/resources/tiled/tiledTsx';

}
