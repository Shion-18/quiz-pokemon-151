import { allPokemon } from '../index';

describe('ポケモンデータ', () => {
  it('初代151匹分のデータが揃っている', () => {
    expect(allPokemon).toHaveLength(151);
  });

  it('IDが1〜151で重複も欠番もない', () => {
    const ids = allPokemon.map((pokemon) => pokemon.id);

    expect(new Set(ids).size).toBe(151);
    expect(Math.min(...ids)).toBe(1);
    expect(Math.max(...ids)).toBe(151);
  });

  it('全件が日本語名とhttpsの画像URLを持つ', () => {
    for (const pokemon of allPokemon) {
      expect(pokemon.name.japanese).toBeTruthy();
      expect(pokemon.imageUrl).toMatch(/^https:\/\//);
    }
  });
});
