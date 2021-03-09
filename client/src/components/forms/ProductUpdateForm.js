import React from 'react';
import { Select } from 'antd';


const { Option } = Select;

const ProductUpdateForm = ({ 
    handleSubmit, 
    handleChange, 
    setValues,
    values, 
    handleCategoryChange,
    categories,
    subOptions,
    arrayOfSubs,
    setArrayOfSubs,
    selectedCategory,
    }) => {

    //destructure
    const { 
        title, 
        description, 
        price, 
        category, 
        subs, 
        shipping, 
        quantity, 
        images, 
        colors, 
        brands, 
        color, 
        brand
        } = values;

    return (
        <form onSubmit={ handleSubmit }>
                        <div className="form-group">
                            <label><u>Title</u></label>
                            <input 
                                type="text" 
                                name="title" 
                                className="form-control" 
                                value={title} 
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label><u>Description</u></label>
                            <input 
                                type="text" 
                                name="description" 
                                className="form-control" 
                                value={description} 
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label><u>Price</u></label>
                            <input 
                                type="number" 
                                name="price" 
                                className="form-control" 
                                value={price} 
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label><u>Shipping</u></label>
                            <select
                            value={shipping === 'Yes' ? 'Yes' : 'No'} 
                            name="shipping" 
                            className="form-control" 
                            onChange={handleChange}
                            >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label><u>Quantity</u></label>
                            <input 
                                type="number" 
                                name="quantity" 
                                className="form-control" 
                                value={quantity} 
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label><u>Color</u></label>
                            <select 
                            value={values.color}
                            name="color" 
                            className="form-control" 
                            onChange={handleChange}>
                                {colors.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label><u>Brand</u></label>
                            <select
                            value={values.brand} 
                            name="brand" 
                            className="form-control" 
                            onChange={handleChange}>
                                {brands.map((b) => (
                                <option key={b} value={b}>
                                    {b}
                                </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-group">
                        <label><u>Parent Category</u></label>
                        <select 
                            name="category" 
                            className="form-control" 
                            onChange={handleCategoryChange}
                            value={selectedCategory ? selectedCategory : category._id}
                        >
                            {categories.length > 0 && 
                                categories.map((c) => (
                                <option key={c._id} value={c._id}>
                                    { c.name }
                                </option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label><u>Sub Categories</u></label>
                        <Select
                            mode="multiple"
                            style={{width: '100%'}}
                            placeholder="Please Select"
                            value={arrayOfSubs}
                            onChange={(value) => setArrayOfSubs(value)}
                        >
                            {subOptions.length && 
                                subOptions.map((s) => (
                                <Option key={s._id} value={s._id}>
                                    {s.name}
                                    </Option>
                            ))}
                        </Select>
                    </div>

                    <br />
                        <button className="bt btn-outline-info">Save</button>
                    </form>
    );
};

export default ProductUpdateForm;