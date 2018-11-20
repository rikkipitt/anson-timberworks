class BlogsController < ApplicationController
  before_action :set_blog, only: [:show]

  def index
    if params[:tag]
      @tag = Tag.friendly.find(params[:tag])
      @blogs = Blog.tagged_with(@tag.slug).published.paginate(page: params[:page])
    else
      @blogs = Blog.published.paginate(page: params[:page])
    end
  end

  def show
  end

  private

  def set_blog
    @blog = Blog.friendly.published.find(params[:id])
  end
end
