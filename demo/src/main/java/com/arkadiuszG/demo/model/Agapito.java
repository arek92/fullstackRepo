package com.arkadiuszG.demo.model;

import com.arkadiuszG.demo.model.Member;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Agapito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @OneToMany(mappedBy = "agapito")
//    private List<Member> members;

    @OneToOne
    @JoinColumn(name = "leader_id")
    private Member leader;

    @Override
    public String toString() {
        return "Agapito{" +
                "id=" + id +
                ", leader=" + leader +
                '}';
    }
}

