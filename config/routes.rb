Rails.application.routes.draw do
  mount Ckeditor::Engine => "/ckeditor"
  mount RailsAdmin::Engine => "/admin", as: "rails_admin"
  devise_for :users

  root to: "static#index"
  resources :blogs, only: [:index, :show], path: "blog"
  get "tags/:tag", to: "blogs#index", as: :tag

  get "/blog/:year/:month/:slug", to: redirect("/blog/%{slug}")
  resources :legal_pages, only: :show, path: "legal"
end
