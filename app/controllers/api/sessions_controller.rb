class Api::SessionsController < ApplicationController
  def show
    @user = current_user
    if @user
        render json: @user#'api/users/show'
    else
        render json: { user: nil }
    end
  end

  def create
    credential = params[:credential]
    password = params[:password]
    @user = User.find_by_credentials(credential, password)
    if @user
      login!(@user)
      render json: @user #'api/users/show'
    else
      render json: { errors: ['The provided credentials were invalid.'] }, status: 403
    end
  end

  def destroy
    logout!
    render json: { message: 'success' }
  end
end
