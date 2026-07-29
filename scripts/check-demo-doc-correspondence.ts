/**
 * Ensures each <SceneryDemo> page's primary ```ts fence constructs only classes
 * that the matching demo module also mentions — so the documented example stays
 * a readable extract of what the live demo builds.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve( path.dirname( fileURLToPath( import.meta.url ) ), '..' );
const API_DIR = path.join( ROOT, 'docs/api' );
const DEMOS_DIR = path.join( ROOT, 'docs/.vitepress/demos' );

/** Helpers / types that MD fences may construct without the demo repeating them. */
const ALLOWED_CLASSES = new Set( [
  'AffineTransform',
  'Bounds2',
  'BooleanProperty',
  'Circle',
  'Color',
  'DerivedProperty',
  'Dimension2',
  'Emitter',
  'Font',
  'HBox',
  'LinearFunction',
  'Matrix3',
  'ModelViewTransform2',
  'Node',
  'NumberProperty',
  'Orientation',
  'Path',
  'PhetFont',
  'Property',
  'Range',
  'RangeWithValue',
  'Rectangle',
  'Shape',
  'StringProperty',
  'Tandem',
  'Text',
  'VBox',
  'Vector2'
] );

function walkMarkdown( dir: string ): string[] {
  const out: string[] = [];
  for ( const entry of fs.readdirSync( dir, { withFileTypes: true } ) ) {
    const full = path.join( dir, entry.name );
    if ( entry.isDirectory() ) {
      out.push( ...walkMarkdown( full ) );
    }
    else if ( entry.name.endsWith( '.md' ) ) {
      out.push( full );
    }
  }
  return out;
}

function extractPrimaryTsFence( markdown: string, demoId: string ): string | null {
  const marker = `<SceneryDemo demo="${demoId}"`;
  const idx = markdown.indexOf( marker );
  if ( idx < 0 ) {
    return null;
  }
  const before = markdown.slice( 0, idx );
  const blocks = [ ...before.matchAll( /```ts\n([\s\S]*?)```/g ) ];
  if ( blocks.length === 0 ) {
    return null;
  }
  return blocks[ blocks.length - 1 ][ 1 ];
}

function constructedClasses( source: string ): Set<string> {
  return new Set( [ ...source.matchAll( /\bnew\s+([A-Z][A-Za-z0-9_]*)/g ) ].map( m => m[ 1 ] ) );
}

function mentionedIdentifiers( source: string ): Set<string> {
  return new Set( [ ...source.matchAll( /\b([A-Z][A-Za-z0-9_]{2,})\b/g ) ].map( m => m[ 1 ] ) );
}

export function checkDemoDocCorrespondence(): void {
  const failures: string[] = [];
  let pairCount = 0;

  for ( const mdPath of walkMarkdown( API_DIR ) ) {
    const markdown = fs.readFileSync( mdPath, 'utf8' );
    const demoIds = [ ...markdown.matchAll( /<SceneryDemo\s+demo="([^"]+)"/g ) ].map( m => m[ 1 ] );

    for ( const demoId of demoIds ) {
      pairCount++;
      const relMd = path.relative( ROOT, mdPath );
      const demoPath = path.join( DEMOS_DIR, `${demoId}.ts` );

      if ( !fs.existsSync( demoPath ) ) {
        failures.push( `${relMd}: <SceneryDemo demo="${demoId}" /> but missing ${path.relative( ROOT, demoPath )}` );
        continue;
      }

      const fence = extractPrimaryTsFence( markdown, demoId );
      if ( fence === null ) {
        failures.push( `${relMd}: no \`\`\`ts fence before <SceneryDemo demo="${demoId}" />` );
        continue;
      }

      const demoSource = fs.readFileSync( demoPath, 'utf8' );
      const demoMentions = mentionedIdentifiers( demoSource );
      const missing = [ ...constructedClasses( fence ) ]
        .filter( name => !ALLOWED_CLASSES.has( name ) && !demoMentions.has( name ) )
        .sort();

      if ( missing.length > 0 ) {
        failures.push(
          `${relMd} (demo="${demoId}"): MD constructs [${missing.join( ', ' )}] but ${demoId}.ts never mentions them`
        );
      }
    }
  }

  if ( failures.length > 0 ) {
    console.error(
      'Demo/doc correspondence check failed:\n' + failures.map( f => `  - ${f}` ).join( '\n' )
    );
    process.exit( 1 );
  }

  console.log( `All ${pairCount} SceneryDemo / MD primary-fence pairs correspond (MD new ClassName ⊆ demo).` );
}
