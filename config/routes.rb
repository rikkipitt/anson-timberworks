Rails.application.routes.draw do
mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  devise_for :users
  mount Ckeditor::Engine => '/ckeditor'
end
