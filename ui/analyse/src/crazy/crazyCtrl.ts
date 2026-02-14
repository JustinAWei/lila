import { dragNewPiece } from '@lichess-org/chessground/drag';
import { dropNewPiece } from '@lichess-org/chessground/board';
import type AnalyseCtrl from '../ctrl';
import type { MouchEvent } from '@lichess-org/chessground/types';

let selectedPiece: Piece | undefined;
export const getSelectedPiece = (): Piece | undefined => selectedPiece;

export function clearSelectedPiece(): void {
  selectedPiece = undefined;
}

function dropPocketPiece(ctrl: AnalyseCtrl, key: Key): void {
  if (!selectedPiece) return;
  const s = ctrl.chessground.state;
  s.pieces.set('a0', selectedPiece);
  dropNewPiece(s, 'a0', key);
  clearSelectedPiece();
  ctrl.redraw();
  s.dom.redraw();
}

export function drag(ctrl: AnalyseCtrl, color: Color, e: MouchEvent): void {
  if (e.button !== undefined && e.button !== 0) return; // only touch or left click
  if (ctrl.chessground.state.movable.color !== color) return;
  const el = e.target as HTMLElement;
  const role = el.getAttribute('data-role') as Role,
    number = el.getAttribute('data-nb');
  if (!role || !color || number === '0') return;
  e.stopPropagation();
  e.preventDefault();
  selectedPiece = { color, role };
  ctrl.chessground.selectSquare(null);
  ctrl.chessground.state.events.select = key => dropPocketPiece(ctrl, key);
  ctrl.redraw();
  dragNewPiece(ctrl.chessground.state, { color, role }, e);
}

export function valid(chessground: CgApi, possibleDrops: Key[] | undefined, piece: Piece, pos: Key): boolean {
  if (piece.color !== chessground.state.movable.color) return false;
  if (piece.role === 'pawn' && (pos[1] === '1' || pos[1] === '8')) return false;
  return !possibleDrops || possibleDrops.includes(pos);
}
