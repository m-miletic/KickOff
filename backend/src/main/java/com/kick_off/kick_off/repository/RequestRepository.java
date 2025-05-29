package com.kick_off.kick_off.repository;

import com.kick_off.kick_off.model.Request;
import com.kick_off.kick_off.model.RequestType;
import com.kick_off.kick_off.model.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {

    Page<Request> findByTimeCreatedBetweenAndStatusAndRequester_Id(LocalDateTime from, LocalDateTime until, Status status, Long requesterId, Pageable pageable);
    Page<Request> findByTimeCreatedBetweenAndRequester_Id(LocalDateTime from, LocalDateTime until, Long requesterId, Pageable pageable);

    Page<Request> findByTimeCreatedBetweenAndStatusAndApprover_Id(LocalDateTime from, LocalDateTime until, Status status, Long approverId, Pageable pageable);
    Page<Request> findByTimeCreatedBetweenAndApprover_Id(LocalDateTime from, LocalDateTime until, Long approverId, Pageable pageable);


    Page<Request> findAllByStatusAndRequester_Id(Status status, Long requesterId, Pageable pageable);
    Page<Request> findAllByRequester_Id(Long requesterId, Pageable pageable);

    Page<Request> findAllByStatusAndApprover_Id(Status status, Long approverId, Pageable pageable);
    Page<Request> findAllByApprover_Id(Long approverId, Pageable pageable);

    void deleteByRequester_Id(Long userId);

    Optional<Request> findByRequester_IdAndApprover_Id(Long requesterId, Long approverId);

    List<Request> findAllByRequester_IdAndRequestTypeAndStatusNot(Long requesterId, RequestType requestType, Status status);

}
