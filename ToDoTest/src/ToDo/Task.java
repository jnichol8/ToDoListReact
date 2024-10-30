package ToDo;


public class Task {
	int id;
	String name;
	String desc;
	String catagory;
	int time;
	Boolean isDone;
	
	public Task() {  // No-argument constructor
        this.isDone = false;  // Default value
    }

    public Task(String name, String desc, int time) {
        this.name = name;
        this.desc = desc;
        this.time = time;
        this.isDone = false;
        updateCatagory();  // Ensure category is updated based on time
    }
	
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
    
	public String getName() {
		return name;
	}
	public void setName(String newName) {
		name = newName;
	}
	
	public String getDesc() {
		return desc;
	}
	public void setDesc(String newDesc) {
		desc = newDesc;
	}
	
	public int getTime() {
		return time;
	}
	public void setTime(int newTime) {
		time = newTime;
	}
	public Boolean getIsDone() {
		return isDone;
	}
	public void setIsDone(Boolean isDone) {
		this.isDone = isDone;
	}
	public void markDone() {
		isDone = true;
	}
	public void setCatagory(String newCatagory) {
		catagory = newCatagory;
	}
	public String getCatagory() {
		return catagory;
	}
	public void updateCatagory() {
		if(time <= 15) {
			catagory = "quick";
		}
		else if(time > 15 && time < 30) {
			catagory = "medium";
		}
		else {
			catagory = "long";
		}
	}
	@Override
	public String toString() {
		return (isDone ? "[Done]   " : "[Pending]   ") + name + "   " + catagory + "(" + time + " mins)";
	}
}

