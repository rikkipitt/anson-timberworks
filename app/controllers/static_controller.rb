class StaticController < ApplicationController
  def index
    @home = Home.new
  end
end
