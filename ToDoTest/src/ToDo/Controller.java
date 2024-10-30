package ToDo;

import java.util.ArrayList;
import java.util.Optional;
import java.util.List;
import ToDo.Task;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

//localhost:8080/tasks

@RestController
@CrossOrigin(origins = "http://localhost:3000") // Change the URL as needed
public class Controller {

    private ArrayList<Task> taskList = new ArrayList<>();
    private int currentId = 1; // To assign unique IDs to tasks

    @PostMapping("/tasks")
    public ResponseEntity<Task> addTask(@RequestBody Task task) {
        if (task.getName() == null || task.getDesc() == null || task.getTime() <= 0) {
            return ResponseEntity.badRequest().build(); // Handle invalid input
        }
        
        task.setId(currentId++); // Set a unique ID for the task
        task.setIsDone(false); // Default isDone to false
        taskList.add(task);
        return ResponseEntity.ok(task); // Return the created task
    }

    @GetMapping("/tasks")
    public ArrayList<Task> getTasks() {
        return taskList;
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable int id, @RequestBody Task updatedTask) {
        Optional<Task> taskOptional = taskList.stream().filter(t -> t.getId() == id).findFirst();
        
        if (taskOptional.isPresent()) {
            Task existingTask = taskOptional.get();
            existingTask.setName(updatedTask.getName());
            existingTask.setDesc(updatedTask.getDesc());
            existingTask.setTime(updatedTask.getTime());
            existingTask.setIsDone(updatedTask.getIsDone()); // Update completion status
            return ResponseEntity.ok(existingTask); // Return updated task
        }
        return ResponseEntity.notFound().build(); // Task not found
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable int id) {
        boolean removed = taskList.removeIf(task -> task.getId() == id);
        if (removed) {
            return ResponseEntity.noContent().build(); // Successfully deleted
        }
        return ResponseEntity.notFound().build(); // Task not found
    }
}
