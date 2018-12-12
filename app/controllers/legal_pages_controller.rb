class LegalPagesController < ApplicationController
  def show
    @legal_page = LegalPage.friendly.find(params[:id])
  end
end
