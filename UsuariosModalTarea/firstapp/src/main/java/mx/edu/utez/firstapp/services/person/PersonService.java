package mx.edu.utez.firstapp.services.person;

import mx.edu.utez.firstapp.config.ApiResponse;
import mx.edu.utez.firstapp.models.person.Person;
import mx.edu.utez.firstapp.models.person.PersonRepository;
import mx.edu.utez.firstapp.models.role.Role;
import mx.edu.utez.firstapp.models.role.RoleRepository;
import mx.edu.utez.firstapp.models.user.User;
import mx.edu.utez.firstapp.models.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class PersonService {
    private final PersonRepository repository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public PersonService(PersonRepository repository, UserRepository userRepository,
                         RoleRepository roleRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findAll() {
        return new ResponseEntity<>(
                new ApiResponse(repository.findAll(), HttpStatus.OK),
                HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findById(Long id) {
        Optional<Person> foundPerson = repository.findById(id);
        if (foundPerson.isPresent())
            return new ResponseEntity<>(new ApiResponse(foundPerson.get(), HttpStatus.OK), HttpStatus.OK);
        return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "RecordNotFound"), HttpStatus.NOT_FOUND);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> save(Person person) {
        person.setStatus(true);
        Optional<Person> foundPerson = repository.findByCurp(person.getCurp());
        if (foundPerson.isPresent())
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "RecordAlreadyExist"),
                    HttpStatus.BAD_REQUEST);
        if (person.getUser() != null) {
            Optional<User> foundUser = userRepository.findByUsername(person.getUser().getUsername());
            if (foundUser.isPresent())
                return new ResponseEntity<>(
                        new ApiResponse(
                                HttpStatus.BAD_REQUEST, true, "RecordAlreadyExist"
                        ), HttpStatus.BAD_REQUEST);
            person.getUser().setPerson(person);
            Set<Role> roles = person.getUser().getRoles();
            person.getUser().setRoles(null);
            person = repository.saveAndFlush(person);
            User savedUser = person.getUser();
            for (Role role : roles) {
                if (roleRepository.saveUserRole(role.getId(), savedUser.getId()) <= 0)
                    return new ResponseEntity<>(
                            new ApiResponse(
                                    HttpStatus.BAD_REQUEST, true, "RoleNotAttached"
                            ), HttpStatus.BAD_REQUEST);
            }
        } else {
            person = repository.saveAndFlush(person);
        }
        return new ResponseEntity<>(new ApiResponse(person, HttpStatus.OK), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> updatePerson(Long personId, Person personDetails) {

        Optional<Person> personOptional = repository.findById(personId);
        if (!personOptional.isPresent()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "PersonNotFound"),
                    HttpStatus.NOT_FOUND);
        }

        Person person = personOptional.get();
        // Actualiza los datos de la persona
        person.setName(personDetails.getName());
        person.setSurname(personDetails.getSurname());
        person.setLastname(personDetails.getLastname());
        person.setBirthDate(personDetails.getBirthDate());
        person.setCurp(personDetails.getCurp());

        if (person.getUser() != null && personDetails.getUser() != null) {
            User user = person.getUser();
            // Actualiza los datos del usuario
            user.setUsername(personDetails.getUser().getUsername());
            // Elimina todos los roles existentes
            user.getRoles().clear();
            userRepository.saveAndFlush(user); // Guarda los cambios antes de asignar nuevos roles

            // Asigna los nuevos roles
            Set<Role> newRoles = personDetails.getUser().getRoles();
            if (newRoles != null && !newRoles.isEmpty()) {
                for (Role role : newRoles) {
                    // Asegúrate de que los roles existan en la base de datos antes de asignarlos
                    roleRepository.findById(role.getId()).ifPresent(user.getRoles()::add);
                }
            }
        }

        System.out.println("Va a guardar a la person ***********************************************");
        Person updatedPerson = repository.saveAndFlush(person);
        if(updatedPerson != null){
            return new ResponseEntity<>(new ApiResponse(updatedPerson, HttpStatus.OK), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "PersonNotFound"),
                    HttpStatus.NOT_FOUND);
        }
    }




    //Cambiar el estado a una
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> deactivate(Long id) {
        Optional<Person> foundPerson = repository.findById(id);
        if (!foundPerson.isPresent())
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "RecordNotFound"), HttpStatus.NOT_FOUND);

        Person existingPerson = foundPerson.get();
        if(existingPerson.getStatus() == false){
            existingPerson.setStatus(true);
        }else{
            existingPerson.setStatus(false);
        }

        existingPerson = repository.saveAndFlush(existingPerson);
        return new ResponseEntity<>(new ApiResponse(existingPerson, HttpStatus.OK), HttpStatus.OK);
    }





}
