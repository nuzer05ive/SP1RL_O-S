require 'json'
require_relative 'builders'
require_relative 'zenava_tool'

module SpirlVishnu
  PANEL_OPTIONS = {
    dialog_title: 'Vishnu — SP1RL',
    preferences_key: 'spirl_vishnu_panel',
    scrollable: true,
    resizable: true,
    width: 400,
    height: 600
  }.freeze

  def self.open_panel
    html = UI::HtmlDialog.new(PANEL_OPTIONS)
    base = File.dirname(__FILE__)
    html.set_file(File.join(base, 'panel.html'))

    html.add_action_callback('build') do |_ctx, kind|
      method = "build_#{kind}".to_sym
      mesh = SketchupBuilders.send(method)

      scenes = File.expand_path('../../data/scenes', __dir__)
      Dir.mkdir(scenes) unless Dir.exist?(scenes)
      File.write(File.join(scenes, "#{kind}.json"), JSON.pretty_generate(mesh))

      html.execute_script("window.renderMesh(#{mesh.to_json});")
    end

    html.add_action_callback('fabricate') do |_ctx, payload|
      params = JSON.parse(payload)
      result = ZenavaTool.fabricate(params)
      html.execute_script("window.renderMesh(#{result.to_json});") if result
    end

    html.show
  end

  unless defined?(@@loaded) && @@loaded
    UI.menu('Plugins').add_item('Vishnu — SP1RL') { open_panel }
    @@loaded = true
  end
end
