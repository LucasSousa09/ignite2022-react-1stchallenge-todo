import styles from '../styles/Task.module.css'
import { Trash, Check } from 'phosphor-react'

interface Task{
    id: string,
    content: string,
    checked?: boolean
}

interface TaskProps{
    task: Task,
    onDeleteTask: (taskId:string) => void,
    onCheckTask: (taskId:string) => void,
}


export function Task({task, onCheckTask, onDeleteTask}: TaskProps){

    function handleCheckboxClick(){
        onCheckTask(task.id)
    }

    function handleDeleteTask(){
        onDeleteTask(task.id)
    }

    return(
        <div className={`${styles.taskContainer} ${task.checked ? styles.taskCompleted : ''}`}>
            <button 
                onClick={handleCheckboxClick} 
                className={!task.checked ? styles.checkbox : `${styles.checkbox} ${styles.clicked}`}
            >
                {
                    task.checked &&
                    <Check size={10} weight='bold'/>
                }
            </button>
            <p className={task.checked ? styles.lineThrough : ''}>{task.content}</p>
            <button onClick={handleDeleteTask} className={styles.deleteButton}>
                <Trash size={16}/>
            </button>
        </div>
    )
}