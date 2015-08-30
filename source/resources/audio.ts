/*
 Copyright (C) 2013-2015 by Justin DuJardin

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */


/// <reference path="../resource.ts"/>

module pow2 {

  declare var _:any;

  /**
   * A supported audio format description that maps extensions to resource types.
   */
  export interface IAudioFormat {

    /**
     * The file extension that corresponds to this format.
     */
    extension:string;

    /**
     * The media resource type to check against an audio element.
     */
      type:string;

  }

  /**
   * Use jQuery to load an Audio resource.
   */
  export class AudioResource extends Resource {
    data:HTMLAudioElement;
    private static FORMATS:Object = {
      'mp3': 'audio/mpeg;',
      'ogg': 'audio/ogg; codecs="vorbis"',
      'wav': 'audio/wav; codecs="1"',
      'aac': 'audio/mp4; codecs="mp4a.40.2"'
    };

    /**
     * Detect support for audio files of varying types.
     *
     * Source: http://diveintohtml5.info/everything.html
     */
    static supportedFormats():IAudioFormat[] {
      if (AudioResource._types === null) {
        this._types = [];
        var a = document.createElement('audio');
        if (document.createElement('audio').canPlayType) {
          try {
            // Server editions of Windows will throw "Not Implemented" if they
            // have no access to media extension packs.  Catch this error and
            // leave the detected types at 0 length.
            a.canPlayType('audio/mpeg;');

            _.each(this.FORMATS, (type:string, extension:string) => {
              if (!!a.canPlayType(type).replace(/no/, '')) {
                this._types.push({
                  extension: extension,
                  type: type
                });
              }
            });
          }
          catch (e) {
            // Fall through
          }
        }

      }
      return this._types.slice();
    }

    private static _types:IAudioFormat[] = null;

    load() {
      var formats:IAudioFormat[] = AudioResource.supportedFormats();
      var sources:number = formats.length;
      var invalid:Array<string> = [];
      var incrementFailure:Function = (path:string) => {
        sources--;
        invalid.push(path);
        if (sources <= 0) {
          this.failed("No valid sources at the following URLs\n   " + invalid.join('\n   '));
        }
      };

      if (sources === 0) {
        return _.defer(() => this.failed('no supported media types'));
      }

      var reference:HTMLAudioElement = document.createElement('audio');
      reference.addEventListener('canplaythrough', () => {
        this.data = reference;
        this.ready();
      });

      // Try all supported types, and accept the first valid one.
      _.each(formats, (format:IAudioFormat) => {
        var source = <HTMLSourceElement>document.createElement('source');
        source.type = format.type;
        source.src = this.url + '.' + format.extension;
        source.addEventListener('error', function (e:Event) {
          incrementFailure(source.src);
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        });
        reference.appendChild(source);
      });

      reference.load();
    }
  }
}
