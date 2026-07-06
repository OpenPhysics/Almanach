import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { Text, VBox } from 'scenerystack/scenery';
import { HSlider } from 'scenerystack/sun';
import { Tandem } from 'scenerystack/tandem';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 140;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const temperatureProperty = new NumberProperty( 20, {
    range: new Range( 0, 100 )
  } );

  const readout = new Text( '20 °C' );
  const slider = new HSlider( temperatureProperty, new Range( 0, 100 ), {
    trackSize: { width: 220, height: 5 },
    tandem: Tandem.OPTIONAL
  } );

  const panel = new VBox( {
    spacing: 10,
    align: 'center',
    children: [
      readout,
      slider
    ]
  } );

  const unlinkReadout = temperatureProperty.link( value => {
    readout.string = `${Math.round( value )} °C`;
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    unlinkReadout();
    panel.dispose();
    slider.dispose();
    temperatureProperty.dispose();
    readout.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
