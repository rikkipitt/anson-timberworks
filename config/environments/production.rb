require Rails.root.join("config/smtp")
Rails.application.configure do
  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local = false
  config.action_controller.perform_caching = true
  config.public_file_server.enabled = ENV["RAILS_SERVE_STATIC_FILES"].present?
  config.assets.js_compressor = :uglifier
  config.assets.compile = false
  config.action_controller.asset_host = ENV.fetch("ASSET_HOST", ENV.fetch("APPLICATION_HOST"))
  config.active_storage.service = :local
  config.log_level = :debug
  config.log_tags = [:request_id]
  config.action_mailer.perform_caching = false
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = SMTP_SETTINGS
  config.i18n.fallbacks = true
  config.active_support.deprecation = :notify
  config.log_formatter = ::Logger::Formatter.new
  if ENV["RAILS_LOG_TO_STDOUT"].present?
    logger = ActiveSupport::Logger.new(STDOUT)
    logger.formatter = config.log_formatter
    config.logger = ActiveSupport::TaggedLogging.new(logger)
  end
  config.active_record.dump_schema_after_migration = false

  if ENV.fetch("HEROKU_APP_NAME", "").include?("staging-pr-")
    ENV["APPLICATION_HOST"] = ENV["HEROKU_APP_NAME"] + ".herokuapp.com"
  end
  config.middleware.use Rack::CanonicalHost, ENV.fetch("APPLICATION_HOST")
  config.middleware.use Rack::Deflater
  config.public_file_server.headers = {
    "Cache-Control" => "public, max-age=31557600",
  }
  config.action_mailer.default_url_options = {host: ENV.fetch("APPLICATION_HOST")}
  config.action_mailer.asset_host = ENV.fetch("ASSET_HOST", ENV.fetch("APPLICATION_HOST"))
  config.force_ssl = ENV["FORCE_SSL"].present?
  PAPERCLIP_STORAGE_OPTIONS = {
    storage: :s3,
    s3_credentials: "#{Rails.root}/config/s3.yml",
    s3_host_name: "s3-eu-west-1.amazonaws.com",
    s3_region: "eu-west-1",
    s3_protocol: "https",
  }
end
