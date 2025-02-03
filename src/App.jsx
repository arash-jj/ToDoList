import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setDarkMode(savedTheme === 'dark');
  }, []);

  // Save theme to localStorage and toggle HTML class
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  // Add todo 
  const addTodo = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: inputText,
        completed: false
      }]);
      setInputText('');
    }
  };
  // Toggle completion
  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  // Search and filter
  useEffect(() => {
    const filtered = todos.filter(todo => {
      const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || 
      (filter === 'active' && !todo.completed) || 
      (filter === 'completed' && todo.completed);
      return matchesSearch && matchesFilter;
    });
    setFilteredTodos(filtered);
  }, [todos, searchTerm, filter]);
  return (
    <div className={`min-h-screen p-8 transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Todo List</h1>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {darkMode ? 'Dark' : 'Light'}
          </button>
        </div>
        {/* Add Form */}
        <form onSubmit={addTodo} className="flex gap-4 mb-8">
          <input
            className={`flex-1 p-3 border-b-2 focus:outline-none bg-transparent transition-colors ${
              darkMode 
                ? 'border-blue-400 focus:border-blue-600 text-gray-200' 
                : 'border-blue-400 focus:border-blue-600 text-gray-800'
            }`}
            placeholder='Add a new item'
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            type='submit'
            className={`px-6 py-3 rounded-lg transition-colors ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Add
          </button>
        </form>
        {/* Todo List */}
        <div className={`rounded-lg shadow-lg overflow-hidden transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="max-h-[60vh] overflow-y-auto">
            <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
              {filteredTodos.map(todo => (
                <li key={todo.id} className={`group transition-colors p-4 ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleComplete(todo.id)}
                        className={`w-5 h-5 rounded focus:ring-2 ${
                          darkMode
                            ? 'text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-600'
                            : 'text-blue-500 bg-white border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      <span className={`text-lg ${
                        todo.completed 
                          ? 'text-gray-400 line-through' 
                          : darkMode 
                            ? 'text-gray-200' 
                            : 'text-gray-700'
                      }`}>
                        {todo.text}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className={`opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 rounded ${
                        darkMode
                          ? 'text-red-400 hover:bg-gray-600'
                          : 'text-red-500 hover:bg-red-50'
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Footer */}
          <div className={`p-4 border-t transition-colors ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {todos.filter(todo => !todo.completed).length} items left
              </div>
              <div className="flex gap-2">
                {['all', 'active', 'completed'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      filter === f 
                        ? darkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 text-white'
                        : darkMode
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`px-4 py-2 rounded-lg border focus:outline-none transition-colors ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                type="search"
                placeholder='Search items...'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App