class ApplicationController < ActionController::Base
  before_action :get_legal_menus

  def get_legal_menus
    @legal_pages ||= LegalPage.all
  end
end
