import './styles/global.css'
import styles from './styles/App.module.css'

import { PlusCircle, ClipboardText, Sun, Moon } from 'phosphor-react'

import rocketIcon from './assets/rocket.svg'

import { Task } from './components/Task'
import { useEffect, useState } from 'react'

interface Task{
  id: string,
  content: string,
  checked?: boolean
}

export function App() {
  const [ tasksList, setTasksList ] = useState<Task[]>([])
  const [ tasksCompleted, setTasksCompleted ] = useState(0)
  const [ newTask, setNewTask ] = useState('')
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const tasksOnLocalStorage = localStorage.getItem('tasksList')
    const themeColor = localStorage.getItem('themeColor')

    if(tasksOnLocalStorage){
      const parsedTasksOnLocalStorage: Task[] = JSON.parse(tasksOnLocalStorage)

      const numberOfCompletedTasks = parsedTasksOnLocalStorage.reduce(
        (prev, current) => {
          if(current.checked){
            return prev + 1
          }
          else{
            return prev + 0
          }
        }, 0
      )
      setTasksList(parsedTasksOnLocalStorage)
      setTasksCompleted(numberOfCompletedTasks)
    }

    if(themeColor){
      setTheme(themeColor)
    }
  },[])

  function checkTask(taskId:string){
    const taskListWithCheckedTask = tasksList.map(task => {
      if(task.id === taskId){
        task.checked = !task.checked
        return task
      }
      return task
    })
    setTasksList(taskListWithCheckedTask)
  
    setTasksCompleted(taskListWithCheckedTask.reduce(
      (prev, current) => {
        if(current.checked){
          return prev + 1
        }
        else{
          return prev + 0
        }
      }, 0
    ))

    localStorage.setItem('tasksList', JSON.stringify(taskListWithCheckedTask))
  }


  function deleteTask(taskId: string){
    const taskListWithoutFilteredTask = tasksList.filter(task => task.id !== taskId)
    
    setTasksList(taskListWithoutFilteredTask)
    
    setTasksCompleted(taskListWithoutFilteredTask.reduce(
      (prev, current) => {
        if(current.checked){
          return prev + 1
        }
        else{
          return prev + 0
        }
      }, 0
    ))
    
    localStorage.setItem('tasksList', JSON.stringify(taskListWithoutFilteredTask))
  }

  const handleEnterKey = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if(evt.key === 'Enter'){
      handleAddNewTask()
    }
  };

  function setDarkTheme() {
     if(theme === 'dark'){
       localStorage.setItem('themeColor', 'light')
       setTheme('light')
     }
     else{
       localStorage.setItem('themeColor', 'dark')
       setTheme('dark')
     } 
  }


  function handleAddNewTask(){
    const newTaskForList = {
      id: new Date().toISOString(),
      content: newTask,
      checked: false
    }

    localStorage.setItem('tasksList', JSON.stringify([...tasksList, newTaskForList]))

    if(newTask.trim().length === 0){
      alert('Uma tarefa deve ter pelo menos uma letra')
      return
    }

    if(tasksList.length <= 0){    
     setTasksList([
        newTaskForList
      ])
    }

    else{
      setTasksList([
        ...tasksList,
        newTaskForList
      ])
    }

    setNewTask('')
  }

  return (
    <div className={styles.appContainer} data-theme={theme}>
      <button className={styles.themeButton} onClick={setDarkTheme}>
        {
          theme === 'dark' ?
          <Sun size={32} className={styles.sunIcon}/> :
          <Moon size={32} className={styles.moonIcon}/>
        }
      </button>
      <header className={styles.appHeader}>
        <img src={rocketIcon} alt="Logo" />
        <h1>
          <span className={styles.to}>to</span><span className={styles.do}>do</span>
        </h1>
      </header>

    <div className={styles.contentContainer}>
      <div className={styles.inputContainer}>
        <input required onKeyDown={handleEnterKey} value={newTask} onChange={evt => setNewTask(evt.target.value)} type="text" placeholder='Adicione uma nova tarefa'/>
        <button disabled={newTask.length === 0} onClick={handleAddNewTask}>Criar <PlusCircle size={16}/> </button>
      </div>

      <div className={styles.tasksContainer}>
        <header>
          <span className={styles.createdTasks}>Tarefas Criadas <span>{tasksList.length}</span> </span>
          <span className={styles.completedTasks}>Tarefas Concluídas <span>{tasksCompleted} de {tasksList.length}</span> </span>
        </header>
        <div className={styles.tasksList}>
          {
            tasksList.length > 0 ? 
            <>
              {
                tasksList.map(task => <Task key={task.id} task={task} onDeleteTask={deleteTask} onCheckTask={checkTask}/>)
              }
            </> :
            (
              <div className={styles.doesNotHasTasksContainer}>
                <ClipboardText  size={48} className={styles.clipboardIcon}/>
                <strong>Você ainda não tem tarefas cadastradas</strong>
                <span>Crie tarefas e organize seus items a fazer</span>
              </div>
            )
          }
        </div>
      </div>
    </div>
    </div>
  )   
}
