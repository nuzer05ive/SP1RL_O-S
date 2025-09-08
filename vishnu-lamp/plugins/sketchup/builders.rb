require 'json'

module SketchupBuilders
  FIXTURE_DIR = File.expand_path('../../fixtures/sketchup', __dir__)

  def self.load_fixture(name)
    path = File.join(FIXTURE_DIR, "#{name}.json")
    JSON.parse(File.read(path), symbolize_names: true)
  end

  def self.build_cycloid(params = {})
    load_fixture('cycloid')
  end

  def self.build_mobius(params = {})
    load_fixture('mobius')
  end

  def self.build_petal_bloom(params = {})
    load_fixture('petal_bloom')
  end

  def self.build_yellow_sack(params = {})
    load_fixture('yellow_sack')
  end
end
