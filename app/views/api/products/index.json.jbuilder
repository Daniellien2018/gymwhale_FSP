json.products({})

json.products do
    @products.each do |product|
        json.set! product.id do
            json.partial! '/api/products/product', product: product
        end
    end
end