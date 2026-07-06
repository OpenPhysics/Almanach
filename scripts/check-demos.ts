import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEMO_IDS } from '../docs/.vitepress/demos/registry.ts';

const DEMOS_DIR = path.resolve( path.dirname( fileURLToPath( import.meta.url ) ), '../docs/.vitepress/demos' );

function checkDemos(): void {
  const failures: string[] = [];

  for ( const id of DEMO_IDS ) {
    const demoPath = path.join( DEMOS_DIR, `${id}.ts` );

    if ( !fs.existsSync( demoPath ) ) {
      failures.push( `${id}: missing file ${demoPath}` );
      continue;
    }

    const source = fs.readFileSync( demoPath, 'utf8' );
    if ( !source.includes( 'export function createDemo' ) ) {
      failures.push( `${id}: missing export function createDemo` );
    }
  }

  if ( failures.length > 0 ) {
    console.error( 'Demo registry check failed:\n' + failures.map( f => `  - ${f}` ).join( '\n' ) );
    process.exit( 1 );
  }

  console.log( `All ${DEMO_IDS.length} Scenery demo modules are present and export createDemo.` );
}

checkDemos();
