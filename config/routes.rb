Rails.application.routes.draw do
  resources :projects
  mount Ckeditor::Engine => "/ckeditor"
  mount RailsAdmin::Engine => "/admin", as: "rails_admin"
  devise_for :users

  root to: "static#index"
end
