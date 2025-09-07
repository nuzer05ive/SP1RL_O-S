module SketchupBuilders
  BASE = {
    geom: {
      positions: [0, 0, 0, 1, 0, 0, 0, 1, 0],
      indices: [0, 1, 2],
      uvs: [0, 0, 1, 0, 0, 1],
    },
  }

  def self.build_cycloid(params = {})
    { kind: 'cycloid', **BASE }
  end

  def self.build_mobius(params = {})
    { kind: 'mobius', **BASE }
  end

  def self.build_petal_bloom(params = {})
    { kind: 'petal_bloom', **BASE }
  end

  def self.build_yellow_sack(params = {})
    { kind: 'yellow_sack', **BASE }
  end
end
