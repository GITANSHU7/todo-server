const User = require('../models/userModels');
const Todo = require('../models/todoModels');

// create todo

exports.createTodo = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        // Check if all required fields are provided
        if (!title || !description || !status) {
            return res.status(400).json({ message: 'All fields (title, description, status) are required' });
        }
        const newTodo = new Todo({
            title,
            description,
            status,
            user: req.user._id
        });
        await newTodo.save();
        res.status(201).json({ message: 'Todo created successfully', newTodo });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


exports.todoList = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const per_page_record = parseInt(req.query.per_page_record);

        let todos;
        let total;

    
        const isAdmin = req.user.userType === 'admin';

        if (page && per_page_record) {
            const pageInt = parseInt(page);
            const perPageRecordInt = parseInt(per_page_record);
            const startIndex = (pageInt - 1) * perPageRecordInt;

            total = isAdmin
                ? await Todo.countDocuments()
                : await Todo.countDocuments({ user: req.user._id }); 

            todos = await Todo.find(isAdmin ? {} : { user: req.user._id }) 
                .populate('user', 'name email') 
                .sort({ createdAt: -1 }) 
                .skip(startIndex) 
                .limit(perPageRecordInt); 
        } else {
        
            todos = await Todo.find(isAdmin ? {} : { user: req.user._id })
                .populate('user', 'name email') 
                .sort({ createdAt: -1 }); 

            total = todos.length; // Total count
        }

        const todosWithCounts = todos.map(todo => ({
            ...todo._doc,
            user: todo.user, 
        }));

        return res.json({
            message: "Todo list retrieved successfully",
            data: todosWithCounts,
            total: total,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const todoId = req.params.id;
        const { title, description, status } = req.body;

        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        let isUpdated = false;
        if (title && title !== todo.title) {
            todo.title = title;
            isUpdated = true;
        }
        if (description && description !== todo.description) {
            todo.description = description;
            isUpdated = true;
        }
        if (status && status !== todo.status) {
            todo.status = status;
            isUpdated = true;
        }


        if (isUpdated) {
            const savedTodo = await todo.save();
            return res.json({
                message: "Todo updated successfully",
                success: true,
                data: savedTodo,
            });
        } else {
            return res.json({
                message: "No changes detected",
                success: true,
            });
        }
    } catch (error) {
        // erorr response
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

//delete todo

exports.deleteTodo = async (req, res) => {
    try {
        const todoId = req.params.id;
        const todo = await Todo.findByIdAndDelete(todoId);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        
        return res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
