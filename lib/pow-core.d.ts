/// <reference path="../types/underscore.d.ts" />
declare module pow2 {
    function getWorld<T>(name: string): T;
    function registerWorld(name: string, instance: any): any;
    function unregisterWorld(name: string): any;
}
declare module pow2 {
    interface IEvents {
        on(name: any, callback?: Function, context?: any): IEvents;
        off(name?: string, callback?: Function, context?: any): IEvents;
        once(events: string, callback: Function, context?: any): IEvents;
        trigger(name: string, ...args: any[]): IEvents;
    }
    class Events implements IEvents {
        private _events;
        public on(name: any, callback?: Function, context?: any): IEvents;
        public once(name: any, callback?: Function, context?: any): IEvents;
        public off(name: any, callback?: Function, context?: any): IEvents;
        public trigger(name: string, ...args: any[]): IEvents;
    }
}
declare module pow2 {
    interface IResource {
        url: string;
        data: any;
        extension: string;
        load(): any;
        isReady(): boolean;
        ready(): any;
        failed(error: any): any;
    }
    class Resource extends Events implements IResource {
        public url: string;
        public data: any;
        public extension: string;
        public loader: ResourceLoader;
        private _ready;
        constructor(url: string, data?: any);
        public load(): void;
        public setLoader(loader: ResourceLoader): void;
        public isReady(): boolean;
        public ready(): void;
        public failed(error: any): void;
    }
}
declare module pow2 {
    class Point {
        public x: number;
        public y: number;
        constructor();
        constructor(point: Point);
        constructor(x: number, y: number);
        constructor(x: string, y: string);
        public toString(): string;
        public set(point: Point): Point;
        public set(x: number, y: number): Point;
        public clone(): Point;
        public copy(from: Point): Point;
        public truncate(): Point;
        public round(): Point;
        public add(x: number, y: number): Point;
        public add(value: number): Point;
        public add(point: Point): Point;
        public subtract(point: Point): Point;
        public multiply(x: number, y: number): Point;
        public multiply(value: number): Point;
        public multiply(point: Point): Point;
        public divide(x: number, y: number): Point;
        public divide(value: number): Point;
        public divide(point: Point): Point;
        public inverse(): Point;
        public equal(point: Point): boolean;
        public isZero(): boolean;
        public zero(): Point;
        public interpolate(from: Point, to: Point, factor: number): Point;
        public magnitude(): number;
        public magnitudeSquared(): number;
        public normalize(): Point;
    }
}
declare module pow2 {
    interface IRect {
        point: Point;
        extent: Point;
    }
    class Rect implements IRect {
        public point: Point;
        public extent: Point;
        constructor();
        constructor(rect: IRect);
        constructor(point: Point, extent: Point);
        constructor(x: number, y: number, width: number, height: number);
        public toString(): string;
        public set(rect: IRect): Rect;
        public set(point: Point, extent: Point): Rect;
        public set(x: number, y: number, width: number, height: number): any;
        public clone(): Rect;
        public clamp(rect: IRect): Rect;
        public clip(clipRect: IRect): Rect;
        public isValid(): boolean;
        public intersect(clipRect: IRect): boolean;
        public pointInRect(point: Point): boolean;
        public pointInRect(x: number, y: number): boolean;
        public getCenter(): Point;
        public setCenter(point: Point): Rect;
        public setCenter(x: number, y: number): Rect;
        public scale(value: number): Rect;
        public round(): Rect;
        public getLeft(): number;
        public getTop(): number;
        public getRight(): number;
        public getBottom(): number;
        public getHalfSize(): Point;
        public addPoint(value: Point): void;
        public inflate(x?: number, y?: number): Rect;
    }
}
declare module pow2 {
    class AudioResource extends Resource {
        public data: HTMLAudioElement;
        static types: Object;
        public load(): void;
    }
}
declare module pow2 {
    class ImageResource extends Resource {
        public load(): void;
    }
}
declare module pow2 {
    class JSONResource extends Resource {
        public load(): void;
    }
}
declare module pow2 {
    class ScriptResource extends Resource {
        public load(): void;
    }
}
declare module pow2 {
    class XMLResource extends Resource {
        public data: any;
        public load(): void;
        public prepare(data: any): void;
        public getElTag(el: any): string;
        public getRootNode(tag: string): any;
        public getChildren<T>(el: any, tag: string): T[];
        public getChild<T>(el: any, tag: string): T;
        public getElAttribute(el: any, name: string): any;
    }
}
declare module pow2 {
    interface IProcessObject {
        _uid: string;
        tick? (elapsed: number): any;
        processFrame? (elapsed: number): any;
    }
    class Time {
        public autoStart: boolean;
        public tickRateMS: number;
        public mspf: number;
        public world: any;
        public lastTime: number;
        public time: number;
        public running: boolean;
        public objects: IProcessObject[];
        constructor(options: Object);
        static get(): Time;
        public start(): void;
        public stop(): void;
        public removeObject(object: IProcessObject): void;
        public addObject(object: IProcessObject): void;
        public tickObjects(elapsedMS: number): void;
        public processFrame(elapsedMS: number): void;
        public polyFillAnimationFrames(): void;
    }
}
declare module pow2 {
    interface IState {
        name: string;
        enter(machine: IStateMachine): any;
        exit(machine: IStateMachine): any;
        update(machine: IStateMachine): any;
    }
    interface IStateTransition {
        targetState: string;
        evaluate(machine: IStateMachine): boolean;
    }
    class State implements IState {
        public name: string;
        public transitions: IStateTransition[];
        public enter(machine: IStateMachine): void;
        public exit(machine: IStateMachine): void;
        public update(machine: IStateMachine): void;
    }
    class StateTransition implements IStateTransition {
        public targetState: string;
        public evaluate(machine: IStateMachine): boolean;
    }
}
declare module pow2 {
    interface IStateMachine extends IEvents {
        update(data: any): any;
        addState(state: IState): any;
        addStates(states: IState[]): any;
        getCurrentState(): IState;
        getCurrentName(): string;
        setCurrentState(name: string): boolean;
        setCurrentState(state: IState): boolean;
        setCurrentState(newState: any): boolean;
        getPreviousState(): IState;
        getState(name: string): IState;
    }
    class StateMachine extends Events implements IStateMachine, IWorldObject {
        public defaultState: string;
        public states: IState[];
        private _currentState;
        private _previousState;
        private _newState;
        public world: IWorld;
        public onAddToWorld(world: any): void;
        public onRemoveFromWorld(world: any): void;
        public update(data?: any): void;
        public addState(state: IState): void;
        public addStates(states: IState[]): void;
        public getCurrentState(): IState;
        public getCurrentName(): string;
        public setCurrentState(state: IState): boolean;
        public setCurrentState(state: string): boolean;
        public getPreviousState(): IState;
        public getState(name: string): IState;
    }
    class TickedStateMachine extends StateMachine {
        public paused: boolean;
        public world: IWorld;
        public onAddToWorld(world: any): void;
        public onRemoveFromWorld(world: any): void;
        public tick(elapsed: number): void;
    }
}
declare module pow2 {
    interface IWorld {
        loader: ResourceLoader;
        time: Time;
        state: IStateMachine;
        mark(object: IWorldObject): any;
        erase(object: IWorldObject): any;
        setService(name: string, value: IWorldObject): IWorldObject;
    }
    interface IWorldObject {
        world: IWorld;
        onAddToWorld? (world: IWorld): any;
        onRemoveFromWorld? (world: IWorld): any;
    }
    class World implements IWorld {
        public loader: ResourceLoader;
        public time: Time;
        public state: IStateMachine;
        constructor(services?: any);
        public setService(name: string, value: IWorldObject): IWorldObject;
        public mark(object: IWorldObject): void;
        public erase(object: IWorldObject): void;
    }
}
declare module pow2 {
    class ResourceLoader implements IWorldObject, IProcessObject {
        private _cache;
        private _types;
        private _doneQueue;
        public _uid: string;
        public world: IWorld;
        constructor();
        static get(): ResourceLoader;
        public onAddToWorld(world: any): void;
        public onRemoveFromWorld(world: any): void;
        public tick(elapsed: number): void;
        public processFrame(elapsed: number): void;
        public ensureType(extension: string, type: Function): void;
        public getResourceExtension(url: string): string;
        public create(typeConstructor: any, data: any): IResource;
        public loadAsType(source: string, resourceType: any, done?: any): IResource;
        public load(sources: string[], done?: Function): Resource[];
        public load(source: string, done?: Function): Resource;
    }
}
