require 'net/http'
require 'json'

module ZenavaTool
  ZENAVA_URI = URI('http://localhost:3000/zenava/fabricate')

  def self.fabricate(params)
    res = Net::HTTP.post(ZENAVA_URI, params.to_json, 'Content-Type' => 'application/json')
    JSON.parse(res.body, symbolize_names: true)
  rescue StandardError => e
    warn "fabricate error: #{e.message}"
    nil
  end
end
