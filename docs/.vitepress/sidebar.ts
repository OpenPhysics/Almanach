import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import type { DefaultTheme } from 'vitepress';

const DOCS_DIR = path.resolve( path.dirname( fileURLToPath( import.meta.url ) ), '..' );

// Section order and display labels for the sidebar. A top-level docs/ folder
// not listed here still appears (alphabetically, after these), so adding a new
// category does not require touching this file — list it here only to control
// its position or label.
const SECTIONS: Record<string, string> = {
  'getting-started': 'Getting Started',
  'guides': 'Guides',
  'api': 'API',
  'patterns': 'Patterns',
  'styling': 'Styling',
  'accessibility': 'Accessibility',
  'examples': 'Examples',
  'cookbook': 'Cookbook',
  'meta': 'Meta'
};

const EXCLUDED_DIRS = new Set( [ '.vitepress', 'public', 'node_modules' ] );

/**
 * Builds the VitePress sidebar by scanning every top-level folder under docs/
 * and reading each page's frontmatter. Pages sort by `navOrder` then title
 * within their section (see compareItems); pages without a `navOrder` fall
 * back to alphabetical, so uncurated sections — like the API — stay A–Z.
 */
export function buildSidebar(): DefaultTheme.Sidebar {
  const folders = fs.readdirSync( DOCS_DIR, { withFileTypes: true } )
    .filter( entry => entry.isDirectory() && !EXCLUDED_DIRS.has( entry.name ) )
    .map( entry => entry.name );

  const knownOrder = Object.keys( SECTIONS );
  folders.sort( ( a, b ) => {
    const ia = knownOrder.indexOf( a );
    const ib = knownOrder.indexOf( b );
    if ( ia !== -1 && ib !== -1 ) { return ia - ib; }
    if ( ia !== -1 ) { return -1; }
    if ( ib !== -1 ) { return 1; }
    return a.localeCompare( b );
  } );

  return folders.map( folder => {
    const items = collectPages( path.join( DOCS_DIR, folder ), `/${folder}` );
    return {
      text: SECTIONS[ folder ] ?? folder,
      collapsed: false,
      items: items
    };
  } ).filter( section => section.items.length > 0 );
}

// A sidebar item that also carries its frontmatter `navOrder`, used only for
// sorting — the extra field is never consumed by VitePress.
type SortableItem = DefaultTheme.SidebarItem & { navOrder?: number };

// Sort key: pages with a finite `navOrder` lead, ascending; pages without one
// follow, alphabetical by title; ties broken alphabetically. This lets a
// section carry a curated reading order (Getting Started, Guides, Patterns)
// while sections that don't set `navOrder` — notably the lookup-oriented API —
// stay purely alphabetical, and a brand-new page never disrupts a curated flow.
function compareItems( a: SortableItem, b: SortableItem ): number {
  const ao = typeof a.navOrder === 'number' && Number.isFinite( a.navOrder );
  const bo = typeof b.navOrder === 'number' && Number.isFinite( b.navOrder );
  if ( ao && bo ) {
    return a.navOrder! - b.navOrder! || ( a.text ?? '' ).localeCompare( b.text ?? '' );
  }
  if ( ao ) { return -1; }
  if ( bo ) { return 1; }
  return ( a.text ?? '' ).localeCompare( b.text ?? '' );
}

/**
 * Recursively collects pages under `dir`, sorted by `navOrder` then
 * alphabetically. A subdirectory (e.g. `api/axon/`) becomes a nested,
 * collapsible sidebar group rather than being flattened, so categories that
 * grow large (like `api/`, organized one subfolder per library) stay
 * navigable. Library groups never carry a `navOrder`, so they stay A–Z.
 */
function collectPages( dir: string, urlPrefix: string ): DefaultTheme.SidebarItem[] {
  const files: SortableItem[] = [];
  const groups: SortableItem[] = [];
  for ( const entry of fs.readdirSync( dir, { withFileTypes: true } ) ) {
    const fullPath = path.join( dir, entry.name );
    if ( entry.isDirectory() ) {
      const subItems = collectPages( fullPath, `${urlPrefix}/${entry.name}` );
      if ( subItems.length > 0 ) {
        groups.push( {
          text: entry.name,
          collapsed: true,
          items: subItems
        } );
      }
    }
    else if ( entry.name.endsWith( '.md' ) ) {
      const { data } = matter( fs.readFileSync( fullPath, 'utf-8' ) );
      const stem = entry.name.replace( /\.md$/, '' );
      files.push( {
        text: data.title ?? stem,
        link: `${urlPrefix}/${stem}`,
        navOrder: data.navOrder
      } );
    }
  }
  files.sort( compareItems );
  groups.sort( compareItems );
  return [ ...files, ...groups ];
}
